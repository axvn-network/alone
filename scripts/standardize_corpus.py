#!/usr/bin/env python3
"""Create metadata-preserving standardized Markdown and document-level indexes."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from datetime import date
from pathlib import Path
from typing import Any

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_EXTRACTED_ROOT = REPOSITORY_ROOT / "_extracted"
DEFAULT_STANDARDIZED_ROOT = REPOSITORY_ROOT / "_standardized"
EXCLUDED_NAMES = {"index.md", "AI_README.md"}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def simple_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---", 4)
    if end == -1:
        return {}, text
    metadata: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip("'\"")
    return metadata, text[end + 4 :].lstrip("\n")


def document_title(body: str, fallback: str) -> str:
    lines = body.splitlines()
    for index, line in enumerate(lines):
        if "Mã tài liệu" not in line:
            continue
        for candidate in reversed(lines[max(0, index - 4) : index]):
            candidate = re.sub(r"[=_—\-│]+", " ", candidate).strip()
            if candidate and not candidate.startswith("#") and len(candidate) > 5:
                return candidate
    for line in body.splitlines():
        match = re.match(r"^#{1,6}\s+(.+?)\s*$", line)
        if match:
            value = re.sub(r"[*_`]+", "", match.group(1)).strip()
            if value and not value.upper().startswith("MỤC LỤC"):
                return value
    return fallback.replace("-", " ").replace("_", " ").title()


def slugify(value: str) -> str:
    normalized = value.lower().replace("/", "-").replace("\\", "-")
    normalized = normalized.replace("đ", "d")
    normalized = "".join(
        character
        for character in normalized
        if character.isascii() and (character.isalnum() or character in {" ", "-", "_"})
    )
    slug = re.sub(r"[-_ ]+", "-", normalized).strip("-")
    return slug or "document"


def yaml_quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def yaml_list(values: list[str]) -> str:
    return "[" + ", ".join(yaml_quote(value) for value in values) + "]"


def group_for(relative: Path) -> str:
    return "STRATEGY" if relative.parts[0] == "CHIEN_LUOC_2026_2031" else "LEGAL"


def document_type(relative: Path) -> str:
    name = relative.stem
    if name in {"README", "GVI-HL-2026-STRATEGY-MASTER"}:
        return "index"
    if "CHECKLIST" in name:
        return "checklist"
    if "BIEN-BAN" in name:
        return "minutes"
    if "HOP-DONG" in name or "THOA-THUAN" in name:
        return "agreement"
    if "DIEU-LE" in name:
        return "charter"
    return "document"


def classification(metadata: dict[str, str], body: str) -> str:
    value = " ".join(
        item for item in (metadata.get("phân_loại", ""), metadata.get("classification", ""), body[:1200]) if item
    ).upper()
    if "TỐI MẬT" in value or "BÍ MẬT" in value or "MẬT" in value:
        return "confidential"
    return "internal"


def summary(body: str, fallback: str) -> str:
    blocks = re.split(r"\n\s*\n", body)
    for block in blocks:
        if block.lstrip().startswith("#"):
            continue
        lines = [
            re.sub(r"\s+", " ", line).strip()
            for line in block.splitlines()
            if line.strip()
            and not re.fullmatch(r"[=\-─│┌┐└┘ ]+", line.strip())
            and "Mã tài liệu" not in line
            and "Phiên bản" not in line
            and "Phân loại" not in line
        ]
        paragraph = " ".join(lines)
        if len(paragraph) >= 40:
            return paragraph[:280].rstrip()
    return fallback


def relative_extracted_files(extracted_root: Path) -> list[Path]:
    return sorted(
        path
        for path in extracted_root.rglob("*.md")
        if path.is_file() and path.name not in EXCLUDED_NAMES
    )


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def write_json(path: Path, payload: Any) -> None:
    write_text(path, json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--extracted-root", type=Path, default=DEFAULT_EXTRACTED_ROOT)
    parser.add_argument("--destination", type=Path, default=DEFAULT_STANDARDIZED_ROOT)
    parser.add_argument("--expected-markdown-count", type=int, default=47)
    args = parser.parse_args()

    if not args.extracted_root.is_dir():
        raise SystemExit(f"Missing extracted corpus: {args.extracted_root}")
    source_files = relative_extracted_files(args.extracted_root)
    if len(source_files) != args.expected_markdown_count:
        raise SystemExit(f"Expected {args.expected_markdown_count} extracted Markdown files, found {len(source_files)}.")

    documents_root = args.destination / "documents"
    if documents_root.exists():
        shutil.rmtree(documents_root)
    documents: list[dict[str, Any]] = []
    seen_slugs: set[str] = set()

    for extracted_path in source_files:
        relative = extracted_path.relative_to(args.extracted_root)
        raw = extracted_path.read_text(encoding="utf-8")
        source_metadata, body = simple_frontmatter(raw)
        base_slug = slugify(relative.with_suffix("").as_posix())
        slug = base_slug
        suffix = 2
        while slug in seen_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        seen_slugs.add(slug)

        title = document_title(body, relative.stem)
        original_path = (Path("_extracted") / relative).as_posix()
        standardized_path = documents_root / relative
        metadata = {
            "title": title,
            "slug": slug,
            "date": str(date.today()),
            "group": group_for(relative),
            "original_path": original_path,
            "source_sha256": sha256(extracted_path),
            "lang": "vi",
            "document_type": document_type(relative),
            "classification": classification(source_metadata, body),
            "tags": [group_for(relative).lower(), document_type(relative)],
            "summary": summary(body, title),
        }
        header = "---\n" + "\n".join(
            (
                f"title: {yaml_quote(metadata['title'])}",
                f"slug: {yaml_quote(metadata['slug'])}",
                f"date: {yaml_quote(metadata['date'])}",
                f"group: {yaml_quote(metadata['group'])}",
                f"original_path: {yaml_quote(metadata['original_path'])}",
                f"source_sha256: {yaml_quote(metadata['source_sha256'])}",
                f"lang: {yaml_quote(metadata['lang'])}",
                f"document_type: {yaml_quote(metadata['document_type'])}",
                f"classification: {yaml_quote(metadata['classification'])}",
                f"tags: {yaml_list(metadata['tags'])}",
                f"summary: {yaml_quote(metadata['summary'])}",
            )
        ) + "\n---\n\n"
        write_text(standardized_path, header + body.rstrip() + "\n")
        documents.append(
            {
                **metadata,
                "path": standardized_path.relative_to(REPOSITORY_ROOT).as_posix(),
                "word_count": word_count(body),
            }
        )

    documents.sort(key=lambda document: document["original_path"])
    write_json(
        args.destination / "index.json",
        {"schema_version": 1, "document_count": len(documents), "documents": documents},
    )
    index_lines = ["# Chỉ mục corpus chuẩn hóa", "", f"Tổng số tài liệu: **{len(documents)}**.", ""]
    for document in documents:
        index_lines.extend(
            (
                f"## {document['title']}",
                "",
                f"- Slug: `{document['slug']}`",
                f"- Nhóm: `{document['group']}` · Loại: `{document['document_type']}` · Phân loại: `{document['classification']}`",
                f"- Nguồn: `{document['original_path']}`",
                f"- Bản chuẩn hóa: `{document['path']}`",
                f"- Từ: {document['word_count']}",
                f"- Tóm tắt: {document['summary']}",
                "",
            )
        )
    write_text(args.destination / "index.md", "\n".join(index_lines))
    write_text(
        args.destination / "AI_README.md",
        """# Corpus chuẩn hóa Langding

- `_extracted/` là bản sao UTF-8 byte-preserving của nguồn thẩm quyền; không chỉnh sửa trực tiếp.
- `_standardized/documents/` bổ sung metadata retrieval và giữ nguyên body nguồn.
- `index.json` là chỉ mục máy; `index.md` là chỉ mục đọc; `chunks.jsonl` và `index-chunks.jsonl` do `scripts/make_chunks.py` sinh.

## Quy trình

```bash
python3 scripts/import_corpus.py
python3 scripts/standardize_corpus.py
python3 scripts/make_chunks.py
python3 scripts/validate_corpus.py
python3 scripts/create_embeddings.py --embedding-provider openai --vector-store pinecone --dry-run
```

Chỉ thực hiện embedding/upsert thật sau khi có phê duyệt xử lý dữ liệu và cấu hình quyền truy cập phù hợp.
""",
    )
    print(f"Standardized {len(documents)} Markdown files into {args.destination}.")


if __name__ == "__main__":
    main()
