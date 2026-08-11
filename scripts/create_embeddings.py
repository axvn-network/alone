#!/usr/bin/env python3
"""Embed the retrieval chunks and upsert them into a vector store.

Referenced by `_standardized/AI_README.md` and by the `embeddings_dry_run`
validation entry in `.ai/manifest.yaml`.

Safety contract
---------------
`_standardized/chunks.jsonl` is internal and partly confidential material, so
this script never contacts a third party unless it is asked to. `--dry-run`
is the default: it validates every record, reports batching and cost-relevant
counts, and exits without a single network call.

Credentials and endpoints are read from environment variables only and are
never logged or written to disk:

    OPENAI_API_KEY / OPENAI_BASE_URL          embedding provider `openai`
    HUGGINGFACE_API_KEY                       embedding provider `huggingface`
    PINECONE_API_KEY / PINECONE_INDEX_HOST    vector store `pinecone`
    MILVUS_URI / MILVUS_TOKEN                 vector store `milvus`
    PGVECTOR_DSN                              vector store `pgvector`

A real run additionally requires `--confirm-external-upload`, matching the
`external_embedding_requires_approval` rule in `.ai/manifest.yaml`.

Retrieval metadata keeps `slug` and `original_path` on every vector so answers
can cite sources as `[slug | original_path]`.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any, Iterable, Iterator

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CHUNKS = REPOSITORY_ROOT / "_standardized" / "chunks.jsonl"

EMBEDDING_PROVIDERS = ("openai", "huggingface", "local")
VECTOR_STORES = ("pinecone", "milvus", "pgvector", "none")

#: Environment variables required for a real (non dry-run) execution.
REQUIRED_ENVIRONMENT: dict[str, tuple[str, ...]] = {
    "openai": ("OPENAI_API_KEY",),
    "huggingface": ("HUGGINGFACE_API_KEY",),
    "local": (),
    "pinecone": ("PINECONE_API_KEY", "PINECONE_INDEX_HOST"),
    "milvus": ("MILVUS_URI",),
    "pgvector": ("PGVECTOR_DSN",),
    "none": (),
}

#: Metadata carried into the vector store; `original_path` and `slug` enable citation.
VECTOR_METADATA_FIELDS = ("title", "slug", "date", "group", "original_path", "path")


def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def estimated_tokens(text: str) -> int:
    """Rough Vietnamese-friendly estimate; ~1.6 tokens per whitespace word."""
    return int(word_count(text) * 1.6)


def read_chunks(path: Path) -> Iterator[tuple[int, dict[str, Any]]]:
    if not path.is_file():
        raise SystemExit(f"Missing chunk corpus: {path}. Run scripts/make_chunks.py first.")
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                yield line_number, json.loads(line)
            except json.JSONDecodeError as error:
                raise SystemExit(f"Invalid JSONL {path}:{line_number}: {error}") from error


def validate(records: Iterable[tuple[int, dict[str, Any]]]) -> list[dict[str, Any]]:
    """Reject a malformed corpus before any provider is contacted."""
    valid: list[dict[str, Any]] = []
    seen: set[str] = set()
    problems: list[str] = []

    for line_number, record in records:
        identifier = record.get("id")
        text = record.get("text") or ""
        metadata = record.get("metadata") or {}

        if not identifier:
            problems.append(f"line {line_number}: missing id")
            continue
        if identifier in seen:
            problems.append(f"line {line_number}: duplicate id {identifier}")
            continue
        seen.add(identifier)

        if not text.strip():
            problems.append(f"{identifier}: empty text")
            continue
        absent = [field for field in VECTOR_METADATA_FIELDS if not metadata.get(field)]
        if absent:
            problems.append(f"{identifier}: missing metadata {', '.join(absent)}")
            continue
        valid.append(record)

    if problems:
        for problem in problems[:20]:
            print(f"FAIL {problem}")
        raise SystemExit(f"{len(problems)} invalid chunk record(s); nothing was sent anywhere.")
    if not valid:
        raise SystemExit("Chunk corpus is empty.")
    return valid


def vector_payload(record: dict[str, Any]) -> dict[str, Any]:
    metadata = record["metadata"]
    return {
        "id": record["id"],
        "metadata": {field: metadata[field] for field in VECTOR_METADATA_FIELDS},
    }


def batches(records: list[dict[str, Any]], size: int) -> Iterator[list[dict[str, Any]]]:
    for start in range(0, len(records), size):
        yield records[start : start + size]


def missing_environment(names: Iterable[str]) -> list[str]:
    return [name for name in names if not os.environ.get(name)]


def embed_batch(texts: list[str], provider: str, model: str) -> list[list[float]]:
    """Call the configured embedding provider. Only reached outside --dry-run."""
    if provider == "openai":
        from openai import OpenAI  # imported lazily so --dry-run needs no dependency

        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"], base_url=os.environ.get("OPENAI_BASE_URL"))
        response = client.embeddings.create(model=model, input=texts)
        return [item.embedding for item in response.data]

    if provider == "huggingface":
        import requests

        endpoint = os.environ.get(
            "HUGGINGFACE_ENDPOINT",
            f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model}",
        )
        response = requests.post(
            endpoint,
            headers={"Authorization": f"Bearer {os.environ['HUGGINGFACE_API_KEY']}"},
            json={"inputs": texts, "options": {"wait_for_model": True}},
            timeout=120,
        )
        response.raise_for_status()
        return response.json()

    if provider == "local":
        from sentence_transformers import SentenceTransformer

        encoder = SentenceTransformer(model)
        return [vector.tolist() for vector in encoder.encode(texts)]

    raise SystemExit(f"Unsupported embedding provider: {provider}")


def upsert_batch(store: str, vectors: list[dict[str, Any]]) -> None:
    """Upsert embedded vectors. Only reached outside --dry-run."""
    if store == "none":
        return

    if store == "pinecone":
        import requests

        response = requests.post(
            f"{os.environ['PINECONE_INDEX_HOST'].rstrip('/')}/vectors/upsert",
            headers={"Api-Key": os.environ["PINECONE_API_KEY"], "Content-Type": "application/json"},
            json={"vectors": vectors, "namespace": os.environ.get("PINECONE_NAMESPACE", "")},
            timeout=120,
        )
        response.raise_for_status()
        return

    if store == "milvus":
        from pymilvus import MilvusClient

        client = MilvusClient(uri=os.environ["MILVUS_URI"], token=os.environ.get("MILVUS_TOKEN"))
        client.upsert(
            collection_name=os.environ.get("MILVUS_COLLECTION", "langding_chunks"),
            data=[
                {"id": vector["id"], "vector": vector["values"], **vector["metadata"]}
                for vector in vectors
            ],
        )
        return

    if store == "pgvector":
        import psycopg

        table = os.environ.get("PGVECTOR_TABLE", "langding_chunks")
        with psycopg.connect(os.environ["PGVECTOR_DSN"]) as connection:
            with connection.cursor() as cursor:
                for vector in vectors:
                    cursor.execute(
                        f"INSERT INTO {table} (id, embedding, metadata) VALUES (%s, %s, %s) "
                        "ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding, "
                        "metadata = EXCLUDED.metadata",
                        (vector["id"], vector["values"], json.dumps(vector["metadata"], ensure_ascii=False)),
                    )
            connection.commit()
        return

    raise SystemExit(f"Unsupported vector store: {store}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--chunks", type=Path, default=DEFAULT_CHUNKS)
    parser.add_argument("--embedding-provider", choices=EMBEDDING_PROVIDERS, default="openai")
    parser.add_argument("--vector-store", choices=VECTOR_STORES, default="none")
    parser.add_argument("--model", default="text-embedding-3-small")
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--limit", type=int, help="Process only the first N chunks.")
    parser.add_argument(
        "--dry-run",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Validate and report without any network call (default).",
    )
    parser.add_argument(
        "--confirm-external-upload",
        action="store_true",
        help="Required for a real run; acknowledges sending internal corpus text to a provider.",
    )
    args = parser.parse_args()

    if args.batch_size < 1:
        raise SystemExit("--batch-size must be at least 1.")

    records = validate(read_chunks(args.chunks))
    if args.limit is not None:
        records = records[: args.limit]

    tokens = [estimated_tokens(record["text"]) for record in records]
    batch_count = (len(records) + args.batch_size - 1) // args.batch_size
    required = REQUIRED_ENVIRONMENT[args.embedding_provider] + REQUIRED_ENVIRONMENT[args.vector_store]
    absent = missing_environment(required)

    print(f"Chunk corpus       : {args.chunks}")
    print(f"Valid chunks       : {len(records)}")
    print(f"Estimated tokens   : {sum(tokens)} (max per chunk {max(tokens)})")
    print(f"Embedding provider : {args.embedding_provider} · model {args.model}")
    print(f"Vector store       : {args.vector_store}")
    print(f"Batches            : {batch_count} × up to {args.batch_size}")
    print(f"Credentials        : {'from environment: ' + ', '.join(required) if required else 'none required'}")

    if args.dry_run:
        sample = vector_payload(records[0])
        print(f"Sample vector id   : {sample['id']}")
        print(f"Sample citation    : [{sample['metadata']['slug']} | {sample['metadata']['original_path']}]")
        if absent:
            print(f"Note               : {', '.join(absent)} not set; required before a real run.")
        print("Dry run complete; no embeddings were created and no data left this machine.")
        return

    if not args.confirm_external_upload:
        raise SystemExit(
            "Refusing to send internal corpus text without --confirm-external-upload "
            "(see external_embedding_requires_approval in .ai/manifest.yaml)."
        )
    if absent:
        raise SystemExit(f"Missing required environment variables: {', '.join(absent)}")

    processed = 0
    for batch in batches(records, args.batch_size):
        embeddings = embed_batch([record["text"] for record in batch], args.embedding_provider, args.model)
        if len(embeddings) != len(batch):
            raise SystemExit("Provider returned a different number of embeddings than requested.")
        vectors = [
            {**vector_payload(record), "values": embedding}
            for record, embedding in zip(batch, embeddings)
        ]
        upsert_batch(args.vector_store, vectors)
        processed += len(vectors)
        print(f"Embedded and upserted {processed}/{len(records)} chunks.")

    print(f"Completed {processed} chunks into {args.vector_store}.")


if __name__ == "__main__":
    main()
