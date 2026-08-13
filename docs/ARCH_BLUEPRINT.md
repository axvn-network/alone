# Architecture Blueprint: AXVN Tech Holding (Langding)

## 1. Triết lý kiến trúc (Guiding Principles)
- **Route-Centric (Feature-First):** Ưu tiên colocation. Mọi tài nguyên (components, hooks, styles, types) thuộc về một route phải nằm trong thư mục của route đó (`src/app/(site)/...`).
- **Zero-Garbage Policy:** Không tồn tại các thư mục `utils/`, `components/` dùng chung ở root.
- **Strict Typing:** Không `any`. Mọi interface phải được định nghĩa rõ ràng.

## 2. Quy tắc thư mục
- `src/app/(site)/{feature}/components/`: Các component chỉ dùng cho feature đó.
- `src/app/(site)/components/layout/`: Chỉ chứa các thành phần layout dùng chung cho toàn bộ site (Navbar, Footer, etc.).
- `src/lib/`: Chỉ chứa các utility thuần túy (không phụ thuộc React, không chứa UI).
- `src/hooks/`: Đã được loại bỏ. Thay bằng custom hooks nằm cùng với component sử dụng nó hoặc trong thư mục `hooks` của feature đó.

## 3. Quy tắc Import (Guardrails)
- **Cấm tuyệt đối:** Import từ các thư mục legacy (như các folder cũ trong `src/components/`).
- **Khuyến khích:** Sử dụng path alias `@/app/(site)/...` cho các tài nguyên nội bộ feature.

## 4. Kiểm soát
- Mọi thay đổi kiến trúc phải được cập nhật vào đây.
- CI Pipeline sẽ chặn mọi vi phạm về cấu trúc thư mục dựa trên ESLint config.
