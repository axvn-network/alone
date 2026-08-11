#!/usr/bin/env python3
"""Import authoritative Markdown byte-for-byte into the immutable corpus layer."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path
from typing import Any

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_ROOT = REPOSITORY_ROOT.parent / "doc"
DEFAULT_DESTINATION = REPOSITORY_ROOT / "_extracted"
EXPECTED_COLLECTIONS = ("CHIEN_LUOC_2026_2031", "MD")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def source_files(source_root: Path) -> list[Path]:
    missing = [name for name in EXPECTED_COLLECTIONS if not (source_root / name).is_dir()]
    if missing:
        raise SystemExit(f"Missing source collections under {source_root}: {', '.join(missing)}")
    return sorted(path for path in source_root.rglob("*.md") if path.is_file())


def extracted_relative(source_root: Path, source_path: Path) -> Path:
    relative = source_path.relative_to(source_root)
    if relative.parts[0] == "CHIEN_LUOC_2026_2031":
        return Path("CHIEN_LUOC_2026_2031") / relative
    return relative


def write_json(path: Path, payload: Any) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--destination", type=Path, default=DEFAULT_DESTINATION)
    parser.add_argument("--expected-markdown-count", type=int, default=47)
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace an existing extracted file only when the source differs.",
    )
    args = parser.parse_args()

    sources = source_files(args.source_root)
    if len(sources) != args.expected_markdown_count:
        raise SystemExit(
            f"Expected {args.expected_markdown_count} Markdown sources, found {len(sources)} under {args.source_root}."
        )

    args.destination.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, str]] = []
    copied = 0
    for source in sources:
        relative = extracted_relative(args.source_root, source)
        destination = args.destination / relative
        source_hash = sha256(source)
        if destination.exists():
            destination_hash = sha256(destination)
            if destination_hash != source_hash:
                if not args.overwrite:
                    raise SystemExit(
                        f"Extracted file differs from source: {destination}. Re-run with --overwrite after review."
                    )
                shutil.copyfile(source, destination)
                copied += 1
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)
            copied += 1

        if sha256(destination) != source_hash:
            raise SystemExit(f"Hash mismatch after importing {source}.")
        records.append(
            {
                "source_relpath": source.relative_to(args.source_root).as_posix(),
                "original_path": (Path("_extracted") / relative).as_posix(),
                "sha256": source_hash,
            }
        )

    manifest = {
        "schema_version": 1,
        "source_root": str(args.source_root),
        "document_count": len(records),
        "documents": records,
    }
    write_json(args.destination / "manifest.json", manifest)
    print(f"Imported {len(records)} Markdown files; copied {copied} into {args.destination}.")


if __name__ == "__main__":
    main()
