---
title: "Langding Project Context"
slug: "langding-project-context"
date: "2026-08-09"
group: "GOVERNANCE"
original_path: ""
tags: [architecture, governance, gvi, agents]
lang: "vi"
summary: "Bản đồ kỹ thuật, quy ước nội dung và ranh giới triển khai cho Langding."
---

# Langding — Project Context

## 1. Project overview
Langding là website công khai, CMS quản trị và cổng cổ đông cho GVI Tech Holding. Website công bố định hướng hệ sinh thái số và nội dung tham chiếu; không phải nền tảng giao dịch hay lời chào bán tài chính.

## 2. Audience and goals
Khách truy cập xem thông tin GVI; quản trị viên quản lý nội dung; cổ đông được phân quyền dùng portal. Mục tiêu là thông tin nhất quán, rõ nguồn và an toàn.

## 3. Public brand
Tên công khai là **GVI Tech Holding** / **GVI Group**. Canonical URL là `https://vnkr.vn`. Asset logo hiện tại chỉ là placeholder cho đến khi có brand kit GVI chính thức.

## 4. Product strategy source
Định hướng GVI lấy từ `_extracted/CHIEN_LUOC_2026_2031/` sau khi tìm bằng `_standardized/index.json` hoặc `chunks.jsonl`, rồi xác minh theo `original_path`. Trích dẫn: `[slug | original_path]`.

## 5. Technical source of truth
Sự thật kỹ thuật chỉ lấy từ mã nguồn, `package.json`, cấu hình và tài liệu này. Không suy diễn kiến trúc Langding từ tài liệu GVI/VNKR khác.

## 6. Technology stack
Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, Framer Motion, Mongoose/MongoDB, Zod, Nodemailer, Cloudinary, Sentry và PM2/Nginx deployment.

## 7. Folder structure
`src/app` chứa routes/pages và route handlers; `src/components` là UI; `src/services` điều phối nghiệp vụ; `src/models` là schema Mongoose; `src/lib` là hạ tầng; `src/validators` là Zod; `scripts` là vận hành/corpus; `_extracted` là nguồn bất biến; `_standardized` là retrieval layer.

## 8. System architecture
Browser gọi Next.js App Router. Public pages dùng server/client components; API handlers gọi service → Mongoose/MongoDB. Admin và shareholder portal dùng session cookie; SSE phát sự kiện in-process.

## 9. Module breakdown
Public marketing, CMS/admin, documents, enquiries, investment plans, shareholder portal, media upload, AI assist, corpus tooling là các module chính. Dùng service layer cho API thay vì truy cập model trực tiếp trong UI.

## 10. Request flow
Client → middleware/proxy guards và headers → App Router page/route handler → validator → service → model/database → typed API response. Mutation admin yêu cầu session và CSRF.

## 11. Authentication
Admin dùng cookie HMAC httpOnly. Cổ đông dùng session riêng. Không đưa token vào local storage; secrets chỉ đọc từ environment variables.

## 12. Authorization
Admin/superadmin và roles cổ đông được kiểm tra ở server. UI visibility không phải authorization; route handlers phải kiểm tra quyền.

## 13. Database
MongoDB/Mongoose lưu CMS, blog, documents, enquiries, plans, shareholders và audit data. Không đổi collection/model legacy có tên Fortress trong đợt rebrand.

## 14. API architecture
Routes đặt tại `src/app/api`. Dùng helpers response/error, Zod validation và service layer. Public route chỉ trả dữ liệu đã publish; admin mutation cần CSRF.

## 15. Business flows
Public contact/partner enquiry → validation → enquiry service; quản trị nội dung → audit; shareholder portal → tasks/meetings/messages; corpus → standardized documents → chunks → optional embedding.

## 16. Dependency graph
UI phụ thuộc component/constants/hooks; routes phụ thuộc services; services phụ thuộc models/lib; corpus scripts độc lập với runtime application. Tránh để public UI đọc trực tiếp `_extracted` hoặc `chunks.jsonl`.

## 17. External services
MongoDB, Cloudinary, SMTP, Google Analytics, Meta Pixel, WhatsApp và Gemini AI là tích hợp tùy cấu hình. Embedding/vector services là ví dụ opt-in, không được gọi nếu chưa có phê duyệt.

## 18. Configuration
`.env.local` chứa secrets. `NEXT_PUBLIC_APP_URL` phải là `https://vnkr.vn` khi production. Không commit API key, password, DSN hay token.

## 19. Logging and audit
Lỗi server qua safe error handling; audit log lưu hành động quản trị. Không log secrets, access token, dữ liệu KYC hay toàn văn corpus nội bộ.

## 20. Error handling
Chuẩn hóa lỗi qua `src/utils/errors.ts` và API response helpers. Client hiển thị thông báo an toàn; không làm lộ stack trace hoặc cấu hình.

## 21. Security
Cookie an toàn, CSRF double-submit, rate limit, Zod validation, sanitizer và security headers. Corpus/public documents không được lộ đường dẫn nội bộ hoặc metadata vector.

## 22. Performance and scalability
Public pages ưu tiên static/prerender theo Next.js 16; hình ảnh dùng `next/image`. SSE hiện in-memory, phù hợp một tiến trình hoặc cần broker trước khi scale ngang.

## 23. Deployment
`npm run build` tạo Next standalone build; PM2/Nginx là hướng deployment hiện có. Chỉ thay URL/copy, không tự đổi middleware thành proxy hoặc đổi hạ tầng.

## 24. Testing
Kiểm tra tối thiểu: corpus validator, embedding dry-run, `npx tsc --noEmit --pretty false`, `npm run build`, `git diff --check`, và visual QA public routes.

## 25. Coding conventions
Giữ UTF-8; patch nhỏ; không format toàn repo; không sửa generated/lock/vendor files ngoài yêu cầu. Đọc tài liệu Next.js liên quan trước khi sửa code framework.

## 26. Strengths and technical debt
Điểm mạnh: service/validator separation, kiểm soát session/CSRF, corpus hash validation. Nợ kỹ thuật: ESLint FlatCompat currently crashes with circular JSON; legacy route/model/CSS names contain Fortress; CMS content may retain old brand; source strategy contains unverified or conflicting claims.

## 27. Improvement direction and appendix
Tập trung một `publicBrand` constant, audit CMS branding không đột biến dữ liệu, tách public strategic summaries khỏi restricted corpus, và thay SSE in-memory nếu cần scale ngang. Mọi claim chiến lược/pháp lý phải được xác minh nguồn gốc và công bố kèm notice.
