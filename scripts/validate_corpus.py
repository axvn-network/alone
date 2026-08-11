#!/usr/bin/env python3
"""Validate source-preserving corpus coverage, metadata, indexes, and chunks."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_ROOT = REPOSITORY_ROOT.parent / "doc"
DEFAULT_EXTRACTED_ROOT = REPOSITORY_ROOT / "_extracted"
DEFAULT_STANDARDIZED_ROOT = REPOSITORY_ROOT / "_standardized"
REQUIRED_METADATA = {
    "title",
    "slug",
    "date",
    "group",
    "original_path",
    "tags",
    "lang",
    "summary",
    "source_sha256",
    "document_type",
    "classification",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def markdown_files(root: Path) -> list[Path]:
    return sorted(path for path in root.rglob("*.md") if path.is_file())


def read_markdown(path: Path) -> tuple[dict[str, str], str]:
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


def source_relative(source_root: Path, extracted_relative: Path) -> Path:
    if extracted_relative.parts[:2] == ("CHIEN_LUOC_2026_2031", "CHIEN_LUOC_2026_2031"):
        return source_root / Path(*extracted_relative.parts[1:])
    return source_root / extracted_relative


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f"Invalid JSON: {path}: {error}") from error


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as error:
                raise SystemExit(f"Invalid JSONL {path}:{line_number}: {error}") from error
    return records


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--extracted-root", type=Path, default=DEFAULT_EXTRACTED_ROOT)
    parser.add_argument("--standardized-root", type=Path, default=DEFAULT_STANDARDIZED_ROOT)
    parser.add_argument("--expected-markdown-count", type=int, default=47)
    args = parser.parse_args()

    source_files = markdown_files(args.source_root)
    extracted_files = markdown_files(args.extracted_root)
    standardized_root = args.standardized_root / "documents"
    standardized_files = markdown_files(standardized_root)
    expected = args.expected_markdown_count
    for label, files in (("source", source_files), ("extracted", extracted_files), ("standardized", standardized_files)):
        if len(files) != expected:
            raise SystemExit(f"Expected {expected} {label} Markdown files, found {len(files)}.")

    seen_original_paths: set[str] = set()
    seen_slugs: set[str] = set()
    for standardized in standardized_files:
        metadata, _ = read_markdown(standardized)
        missing = REQUIRED_METADATA - metadata.keys()
        if missing:
            raise SystemExit(f"Missing metadata in {standardized}: {', '.join(sorted(missing))}")
        original_path = metadata["original_path"]
        if original_path in seen_original_paths:
            raise SystemExit(f"Duplicate original_path: {original_path}")
        if metadata["slug"] in seen_slugs:
            raise SystemExit(f"Duplicate slug: {metadata['slug']}")
        seen_original_paths.add(original_path)
        seen_slugs.add(metadata["slug"])
        extracted = REPOSITORY_ROOT / original_path
        if not extracted.is_file() or args.extracted_root not in extracted.parents:
            raise SystemExit(f"Invalid original_path: {original_path}")
        if sha256(extracted) != metadata["source_sha256"]:
            raise SystemExit(f"Hash mismatch for standardized source: {standardized}")

    for extracted in extracted_files:
        relative = extracted.relative_to(args.extracted_root)
        source = source_relative(args.source_root, relative)
        if not source.is_file():
            raise SystemExit(f"No matching upstream source for {extracted}")
        if sha256(source) != sha256(extracted):
            raise SystemExit(f"Extracted bytes differ from source: {extracted}")

    index = load_json(args.standardized_root / "index.json")
    if index.get("document_count") != expected or len(index.get("documents", [])) != expected:
        raise SystemExit("Document index count does not match corpus.")
    indexed_original_paths = {document.get("original_path") for document in index["documents"]}
    if indexed_original_paths != seen_original_paths:
        raise SystemExit("Document index does not match standardized metadata.")

    chunks = load_jsonl(args.standardized_root / "chunks.jsonl")
    chunk_index = load_jsonl(args.standardized_root / "index-chunks.jsonl")
    if not chunks or len(chunks) != len(chunk_index):
        raise SystemExit("Chunk corpus and chunk index are missing or have different counts.")
    chunk_ids = [record.get("id") for record in chunks]
    if len(chunk_ids) != len(set(chunk_ids)) or any(not identifier for identifier in chunk_ids):
        raise SystemExit("Chunk IDs must be present and unique.")
    indexed_chunk_ids = {record.get("chunk_id") for record in chunk_index}
    if indexed_chunk_ids != set(chunk_ids):
        raise SystemExit("Chunk index IDs do not match chunk corpus IDs.")
    for chunk in chunks:
        metadata = chunk.get("metadata", {})
        if not chunk.get("text") or metadata.get("original_path") not in seen_original_paths:
            raise SystemExit("Chunk has missing text or an unknown original_path.")

    print(
        f"Validated {expected} source/extracted/standardized documents and {len(chunks)} UTF-8 retrieval chunks."
    )


if __name__ == "__main__":
    main()
