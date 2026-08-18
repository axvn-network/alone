---
title: "Langding Knowledge Base"
slug: "langding-knowledge-base"
date: "2026-08-10"
group: "GOVERNANCE"
tags: [corpus, retrieval, utf8, agents]
lang: "vi"
summary: "Hợp đồng nguồn/truy xuất UTF-8 cho corpus chuẩn hóa Langding: lớp dữ liệu, schema, quy trình tái tạo và quy tắc trích dẫn."
---

# Langding — Knowledge Base

Tài liệu này là hợp đồng nguồn/truy xuất được `AGENTS.md`, `CLAUDE.md`,
`GEMINI.md` và `.ai/manifest.yaml` yêu cầu đọc trước khi nhận việc. Nội dung
kỹ thuật ở đây chỉ mô tả những gì đã kiểm chứng trong repo; định hướng chiến
lược, pháp lý, tài chính phải tra trong corpus rồi đối chiếu `original_path`.

## 1. Ba lớp dữ liệu

| Lớp | Đường dẫn | Vai trò | Quyền ghi |
|---|---|---|---|
| Nguồn thẩm quyền | `../doc/` | Markdown gốc ngoài repo | Không sửa qua agent |
| Bất biến | `_extracted/` | Bản sao byte-for-byte của nguồn | Chỉ đọc |
| Truy xuất | `_standardized/` | Metadata + chỉ mục + chunks | Chỉ sinh bằng script |

`_extracted/` được xác thực bằng SHA-256 so với nguồn. Không chỉnh sửa trực
tiếp bất kỳ file nào trong `_extracted/`; mọi thay đổi phải bắt đầu từ nguồn
rồi chạy lại pipeline.

## 2. Quy mô hiện tại

Số liệu dưới đây lấy từ `_standardized/index.json` và `chunks.jsonl`:

- 47 tài liệu Markdown: 36 trong `MD/` (nhóm `LEGAL`), 11 trong
  `CHIEN_LUOC_2026_2031/` (nhóm `STRATEGY`).
- 189 chunk truy xuất, phủ đủ 47/47 tài liệu, từ 1 đến 16 chunk mỗi tài liệu.
- Độ dài chunk: nhỏ nhất 30 từ, lớn nhất 598 từ, trung bình 449 từ — nằm trong
  cửa sổ mục tiêu ~250–600 từ (~400–800 token).
- Phân loại: 26 `confidential`, 21 `internal`. Toàn bộ `lang: vi`.

## 3. Frontmatter chuẩn

Mỗi file trong `_standardized/documents/` mang frontmatter phẳng, UTF-8, gồm:
`title`, `slug`, `date`, `group`, `original_path`, `source_sha256`, `lang`,
`document_type`, `classification`, `tags`, `summary`. `index.json` bổ sung
`path` và `word_count` cho mỗi tài liệu.

`scripts/validate_corpus.py` bắt buộc 11 trường frontmatter, kiểm tra `slug` và
`original_path` không trùng, và so `source_sha256` với file trong `_extracted/`.

## 4. Schema chunk

`_standardized/chunks.jsonl` — mỗi dòng một object:

```json
{
  "id": "<slug>--0001",
  "text": "…nội dung giữ nguyên UTF-8…",
  "metadata": {
    "title": "…", "slug": "…", "date": "…",
    "group": "STRATEGY|LEGAL",
    "original_path": "_extracted/…md",
    "path": "_standardized/documents/…md"
  }
}
```

`_standardized/index-chunks.jsonl` — chỉ mục vị trí, không chứa `text`:
`chunk_id`, `slug`, `path`, `original_path`, `group`, `chunk_index`,
`start_word`, `end_word`, `word_count`.

Chunk không cắt giữa một block: block là đơn vị phân tách bằng dòng trống, được
gộp tuần tự đến ngưỡng từ rồi mới sang chunk mới.

## 5. Pipeline

```bash
python3 scripts/import_corpus.py       # ../doc -> _extracted (kiểm SHA-256)
python3 scripts/standardize_corpus.py  # _extracted -> _standardized/documents + index.json + index.md
python3 scripts/make_chunks.py --check # kiểm hợp đồng chunk, không ghi gì
python3 scripts/validate_corpus.py     # kiểm toàn bộ 3 lớp
```

`make_chunks.py` mặc định chạy `--check` và không ghi file. Chỉ dùng `--write`
khi chấp nhận sinh lại toàn bộ ranh giới chunk: `id` chunk có thể đổi, làm mất
giá trị của mọi embedding đã tính từ bộ chunk cũ.

## 6. Embeddings

```bash
python3 scripts/create_embeddings.py \
  --embedding-provider openai --vector-store pinecone --dry-run
```

Mặc định là `--dry-run`: script chỉ đọc `chunks.jsonl`, đếm token, in mẫu
citation và không gọi mạng. Một lần chạy thật cần đồng thời
`--no-dry-run` và `--confirm-external-upload`, và sẽ dừng nếu thiếu biến môi
trường. Key/endpoint chỉ đọc từ environment, không bao giờ ghi vào repo.

Đưa nội dung corpus nội bộ ra dịch vụ ngoài phải có phê duyệt trước, theo
`external_embedding_requires_approval` trong `.ai/manifest.yaml`.

## 7. Truy xuất và trích dẫn

Tìm trong `_standardized/index.json` hoặc `chunks.jsonl`, xác minh lại nội dung
trong file `_extracted/` mà `original_path` trỏ tới, rồi trích dẫn theo đúng
định dạng:

```
[slug | original_path]
```

Không suy diễn số liệu chiến lược, pháp lý hay tài chính nếu không tìm được câu
tương ứng trong nguồn.

## 8. Giới hạn công bố

Đầu ra công khai chỉ được là bản tóm tắt. Không công khai nguyên văn
`_extracted/`, không công khai `chunks.jsonl`, `source_sha256`, đường dẫn nội
bộ hay metadata vector. 26 tài liệu đang ở mức `confidential`; mặc định coi nội
dung corpus là nội bộ trừ khi đã có bản tóm tắt được duyệt.

## 9. Sự thật kỹ thuật

Sự thật kỹ thuật của Langding chỉ lấy từ mã nguồn, `package.json`, cấu hình và
[`ARCH_BLUEPRINT.md`](ARCH_BLUEPRINT.md). Không suy ra kiến trúc Langding từ tài liệu chiến lược AXVN/VNKR.
