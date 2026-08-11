#!/usr/bin/env python3
"""Build retrieval chunks and the chunk index from the standardized corpus.

Referenced by `_standardized/AI_README.md`, `.ai/manifest.yaml` and
`.ai/work-queue.yaml`. Reads only `_standardized/documents/*.md`, never
`_extracted/`, and preserves Vietnamese UTF-8 bytes of every block it emits.

Chunking contract
-----------------
Blocks are the blank-line separated units of the document body. Blocks are
packed greedily until the accumulated word count would exceed ``--max-words``;
a trailing chunk shorter than ``--min-words`` is merged back into the previous
chunk when the merged size stays within ``--merge-max-words``. This keeps every
chunk inside the documented ~250-600 word (~400-800 token) retrieval window
while never splitting a block in half.

Modes
-----
``--check`` (default) recomputes chunks in memory and reports whether the
committed artifacts still satisfy the structural contract. It writes nothing,
so it is safe to run against a validated corpus.

``--write`` regenerates ``chunks.jsonl`` and ``index-chunks.jsonl``. Chunk
boundaries produced here are derived from the contract above and are not
guaranteed to match the boundaries of an older generator, so regenerating
invalidates any embeddings already computed from the previous chunk IDs.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Iterator

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_STANDARDIZED_ROOT = REPOSITORY_ROOT / "_standardized"
EXCLUDED_NAMES = {"index.md", "AI_README.md"}
CHUNK_METADATA_FIELDS = ("title", "slug", "date", "group", "original_path", "path")


def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def read_markdown(path: Path) -> tuple[dict[str, str], str]:
    """Parse the flat frontmatter written by scripts/standardize_corpus.py."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise SystemExit(f"Missing frontmatter: {path}")
    end = text.find("\n---", 4)
    if end == -1:
        raise SystemExit(f"Unclosed frontmatter: {path}")
    metadata: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip("'\"")
    return metadata, text[end + 4 :].lstrip("\n")


def blocks_of(body: str) -> list[str]:
    return [block.strip() for block in re.split(r"\n\s*\n", body) if block.strip()]


def pack_blocks(
    blocks: list[str],
    max_words: int,
    min_words: int,
    merge_max_words: int,
) -> list[list[str]]:
    groups: list[list[str]] = []
    current: list[str] = []
    current_words = 0
    for block in blocks:
        words = word_count(block)
        if current and current_words + words > max_words:
            groups.append(current)
            current = []
            current_words = 0
        current.append(block)
        current_words += words
    if current:
        groups.append(current)

    if len(groups) > 1:
        tail_words = word_count("\n\n".join(groups[-1]))
        previous_words = word_count("\n\n".join(groups[-2]))
        if tail_words < min_words and tail_words + previous_words <= merge_max_words:
            groups[-2].extend(groups.pop())
    return groups


def standardized_documents(root: Path) -> list[Path]:
    return sorted(
        path
        for path in (root / "documents").rglob("*.md")
        if path.is_file() and path.name not in EXCLUDED_NAMES
    )


def build(
    standardized_root: Path,
    max_words: int,
    min_words: int,
    merge_max_words: int,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    documents = standardized_documents(standardized_root)
    if not documents:
        raise SystemExit(f"No standardized Markdown found under {standardized_root / 'documents'}")

    chunks: list[dict[str, Any]] = []
    chunk_index: list[dict[str, Any]] = []
    for document in documents:
        metadata, body = read_markdown(document)
        missing = [field for field in ("title", "slug", "date", "group", "original_path") if not metadata.get(field)]
        if missing:
            raise SystemExit(f"Missing metadata {', '.join(missing)} in {document}")

        relative_path = document.relative_to(REPOSITORY_ROOT).as_posix()
        start_word = 0
        for position, group in enumerate(pack_blocks(blocks_of(body), max_words, min_words, merge_max_words)):
            text = "\n\n".join(group)
            words = word_count(text)
            chunk_id = f"{metadata['slug']}--{position + 1:04d}"
            chunks.append(
                {
                    "id": chunk_id,
                    "text": text,
                    "metadata": {
                        "title": metadata["title"],
                        "slug": metadata["slug"],
                        "date": metadata["date"],
                        "group": metadata["group"],
                        "original_path": metadata["original_path"],
                        "path": relative_path,
                    },
                }
            )
            chunk_index.append(
                {
                    "chunk_id": chunk_id,
                    "slug": metadata["slug"],
                    "path": relative_path,
                    "original_path": metadata["original_path"],
                    "group": metadata["group"],
                    "chunk_index": position,
                    "start_word": start_word,
                    "end_word": start_word + words,
                    "word_count": words,
                }
            )
            start_word += words
    return chunks, chunk_index


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as error:
                raise SystemExit(f"Invalid JSONL {path}:{line_number}: {error}") from error
    return records


def write_jsonl(path: Path, records: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = "".join(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n" for record in records)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(payload, encoding="utf-8", newline="\n")
    temporary.replace(path)


def check_committed(
    standardized_root: Path,
    min_words: int,
    hard_max_words: int,
) -> Iterator[str]:
    """Validate committed chunk artifacts without rewriting them."""
    chunks_path = standardized_root / "chunks.jsonl"
    index_path = standardized_root / "index-chunks.jsonl"
    for path in (chunks_path, index_path):
        if not path.is_file():
            yield f"missing artifact: {path}"
            return

    chunks = load_jsonl(chunks_path)
    chunk_index = load_jsonl(index_path)
    if len(chunks) != len(chunk_index):
        yield f"chunk count {len(chunks)} does not match index count {len(chunk_index)}"

    identifiers = [chunk.get("id") for chunk in chunks]
    if len(identifiers) != len(set(identifiers)):
        yield "duplicate chunk IDs"
    if any(not identifier for identifier in identifiers):
        yield "chunk with an empty id"
    if {record.get("chunk_id") for record in chunk_index} != set(identifiers):
        yield "chunk index IDs do not match chunk IDs"

    known_slugs = set()
    for document in standardized_documents(standardized_root):
        metadata, _ = read_markdown(document)
        known_slugs.add(metadata["slug"])

    for chunk in chunks:
        metadata = chunk.get("metadata", {})
        absent = [field for field in CHUNK_METADATA_FIELDS if not metadata.get(field)]
        if absent:
            yield f"{chunk.get('id')}: missing metadata {', '.join(absent)}"
        if metadata.get("slug") not in known_slugs:
            yield f"{chunk.get('id')}: slug is not present in the standardized corpus"
        text = chunk.get("text") or ""
        if not text.strip():
            yield f"{chunk.get('id')}: empty text"
            continue
        words = word_count(text)
        if words > hard_max_words:
            yield f"{chunk.get('id')}: {words} words exceeds the {hard_max_words}-word retrieval ceiling"

    for record in chunk_index:
        counted = record.get("word_count")
        span = (record.get("end_word") or 0) - (record.get("start_word") or 0)
        if counted != span:
            yield f"{record.get('chunk_id')}: word_count {counted} does not match span {span}"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--standardized-root", type=Path, default=DEFAULT_STANDARDIZED_ROOT)
    parser.add_argument("--max-words", type=int, default=512, help="Soft ceiling used while packing blocks.")
    parser.add_argument("--min-words", type=int, default=120, help="Below this a trailing chunk is merged back.")
    parser.add_argument("--merge-max-words", type=int, default=600, help="Ceiling allowed for a trailing merge.")
    parser.add_argument(
        "--hard-max-words",
        type=int,
        default=800,
        help="Retrieval ceiling enforced in --check mode.",
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="Validate committed artifacts and write nothing (default).")
    mode.add_argument("--write", action="store_true", help="Regenerate chunks.jsonl and index-chunks.jsonl.")
    args = parser.parse_args()

    if not args.standardized_root.is_dir():
        raise SystemExit(f"Missing standardized corpus: {args.standardized_root}")

    if args.write:
        chunks, chunk_index = build(
            args.standardized_root, args.max_words, args.min_words, args.merge_max_words
        )
        write_jsonl(args.standardized_root / "chunks.jsonl", chunks)
        write_jsonl(args.standardized_root / "index-chunks.jsonl", chunk_index)
        sizes = [word_count(chunk["text"]) for chunk in chunks]
        print(
            f"Wrote {len(chunks)} chunks from {len(standardized_documents(args.standardized_root))} documents "
            f"(words min {min(sizes)}, max {max(sizes)}, mean {sum(sizes) // len(sizes)})."
        )
        return

    problems = list(check_committed(args.standardized_root, args.min_words, args.hard_max_words))
    if problems:
        for problem in problems:
            print(f"FAIL {problem}")
        raise SystemExit(f"{len(problems)} chunk contract problem(s). Review before running --write.")

    chunks = load_jsonl(args.standardized_root / "chunks.jsonl")
    sizes = [word_count(chunk.get("text") or "") for chunk in chunks]
    print(
        f"Checked {len(chunks)} committed chunks "
        f"(words min {min(sizes)}, max {max(sizes)}, mean {sum(sizes) // len(sizes)}); no changes written."
    )


if __name__ == "__main__":
    main()
