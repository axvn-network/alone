# 🏰 Fortress Investment Holdings System (Hệ Thống Quản Lý & Đầu Tư Fortress)

[![Netlify Status](https://api.netlify.com/api/v1/badges/7af0e4e0-6000-4c25-9cb1-ddf9d5d17cf5/deploy-status)](https://app.netlify.com/projects/fortress88/deploys)

| Môi trường / Nhánh (Branch) | Badge Trạng Thái Deploy |
| :--- | :--- |
| **Production (`main`)** | [![Netlify Status](https://api.netlify.com/api/v1/badges/7af0e4e0-6000-4c25-9cb1-ddf9d5d17cf5/deploy-status?branch=main)](https://app.netlify.com/projects/fortress88/deploys) |
| **Development (`dev`)** | [![Netlify Status (dev)](https://api.netlify.com/api/v1/badges/7af0e4e0-6000-4c25-9cb1-ddf9d5d17cf5/deploy-status?branch=dev)](https://app.netlify.com/projects/fortress88/deploys) |

> System Status: **Production Ready** | Full Vietnamese Localization (100%) | Next.js 15 App Router | Supabase PostgreSQL Engine

---

## 📌 TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Hệ thống **Fortress Investment Holdings** là nền tảng quản lý tài chính và đầu tư doanh nghiệp cao cấp được thiết kế theo tiêu chuẩn hệ thống hiện đại, tối ưu hóa giao diện (UI/UX), hỗ trợ toàn bộ giao diện và dữ liệu bằng **Tiếng Việt 100%**, sẵn sàng cho môi trường production với khả năng mở rộng cao.

### 🎯 Các Tính Năng Cốt Lõi:
1. **Việt Hóa 100% (Full Vietnamese Localization):** Chuẩn hóa toàn bộ thuật ngữ hệ thống (`Người dùng`, `Số dư`, `Nạp tiền`, `Rút tiền`, `Đơn hàng`, `Tài sản`, `Nhật ký hệ thống`).
2. **Giao Diện Chuẩn Stripe / Notion (UI/UX Redesign):**
   - Thiết kế tối giản, sang trọng (Glassmorphism, Dark/Light Mode).
   - Hệ thống thẻ KPI, biểu đồ thống kê thời gian thực.
   - Bảng dữ liệu lọc không cần reload (Real-time Filter).
3. **Phân Quyền Chi Tiết (Role-Based Access Control - RBAC):**
   - `Superadmin`: Toàn quyền quản trị hệ thống, cấu hình cổng thanh toán và logs.
   - `Admin`: Quản lý người dùng, duyệt giao dịch nạp/rút.
   - `Agent` (Đại lý): Theo dõi mạng lưới và hoa hồng đầu tư.
   - `Support` (Hỗ trợ): Xử lý yêu cầu và chăm sóc khách hàng.
4. **Cổng Thanh Toán Đa Kênh (Payment Integration Gateway):**
   - Ví điện tử MoMo (`PAYMENT_MOMO_KEY`)
   - Ngân hàng nội địa VietQR (`PAYMENT_BANK_KEY`)
   - Tiền điện tử USDT BEP20 (`PAYMENT_USDT_WALLET`)
   - Thẻ cào viễn thông Telco (`PAYMENT_TELCO_KEY`)

---

## 🏗️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend:** Next.js 15.5 (App Router, Turbopack), React 19, TailwindCSS v4, Lucide Icons, Framer Motion.
- **Backend & Database:** Node.js API Routes, Supabase PostgreSQL, Mongoose/MongoDB (Fallback), JWT Auth.
- **Biểu đồ & Hiệu ứng:** GSAP, Lenis Smooth Scroll, Sonner Toast Notifications.
- **Hosting & CI/CD:** Netlify, PM2, Nginx, Docker.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & PHÁT TRIỂN (LOCAL SETUP)

### 1. Yêu Cầu Môi Trường:
- Node.js >= 20.x
- npm >= 10.x

### 2. Cài Đặt Mã Nguồn:
```bash
# Clone dự án về máy
git clone https://github.com/hoangbom98/alone.git fortress-website
cd fortress-website

# Cài đặt thư viện dependencies
npm install
```

### 3. Cấu Hình Biến Môi Trường (.env):
Tạo file `.env` hoặc `.env.local` từ mẫu `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các thông số Supabase và Payment Keys:
```env
NEXT_PUBLIC_APP_URL=https://fortress88.netlify.app
NEXT_PUBLIC_SUPABASE_URL=https://qawgducimlnketpfitjb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Gateways
PAYMENT_MOMO_KEY=momo_api_secret_key
PAYMENT_BANK_KEY=vietqr_bank_api_key
PAYMENT_USDT_WALLET=0x1234567890abcdef1234567890abcdef12345678
```

### 4. Chạy Môi Trường Local Development:
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

---

## 📦 CHUẨN HÓA QUY TRÌNH TRIỂN KHAI (PRODUCTION DEPLOYMENT GUIDE)

### CÁCH 1: Triển Khai Tự Động Trên Netlify (Khuyên Dùng Cho Cloud)

Dự án đã được tích hợp sẵn cấu hình Netlify trong [`netlify.toml`](file:///d:/Fortress/Fortress-main/netlify.toml).

1. Kết nối Repository GitHub với Netlify: [Netlify Dashboard](https://app.netlify.com/projects/fortress88/deploys)
2. Cấu hình Build Settings trên Netlify:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - **Node Version:** `20`
3. Thêm các Biến Môi Trường (Environment Variables) trong tab **Site configuration > Environment variables**.
4. Trạng thái Deploy được cập nhật tự động qua Badge:
   [![Netlify Status](https://api.netlify.com/api/v1/badges/7af0e4e0-6000-4c25-9cb1-ddf9d5d17cf5/deploy-status)](https://app.netlify.com/projects/fortress88/deploys)

---

### CÁCH 2: Triển Khai Trên Máy Chủ Ubuntu VPS (Nginx + PM2 + SSL Certbot)

Đối với máy chủ Linux (Ubuntu Server 22.04 / 24.04 LTS):

#### Bước 1: Cài Đặt Node.js & PM2
```bash
# Cài đặt Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

# Cài đặt PM2 toàn cục
sudo npm install -g pm2
```

#### Bước 2: Build & Khởi Chạy Ứng Dụng Với PM2
```bash
# Build dự án
npm run build

# Khởi chạy ứng dụng bằng PM2 Ecosystem Config
pm2 start ecosystem.config.js --env production

# Lưu trạng thái PM2 và bật tự khởi động cùng OS
pm2 save
pm2 startup
```

#### Bước 3: Cấu Hình Nginx Reverse Proxy & SSL Let's Encrypt
1. Tạo file cấu hình Nginx: `/etc/nginx/sites-available/fortress.conf` (sử dụng mẫu [`nginx.conf.example`](file:///d:/Fortress/Fortress-main/nginx.conf.example)).
2. Kích hoạt domain và nạp lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/fortress.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
3. Cấp chỉ SSL miễn phí qua Certbot:
```bash
sudo certbot --nginx -d fortressih.com -d www.fortressih.com
```

---

## 🛠️ KIỂM TRA & XÁC NHẬN TRIỂN KHAI (VERIFICATION)

- [x] Giao diện người dùng & Admin hoạt động mượt mà (100% Tiếng Việt).
- [x] Khởi tạo build thành công không lỗi TypeScript / ESLint.
- [x] Kết nối Supabase PostgreSQL và API endpoints chính xác.
- [x] Cấu hình Netlify Status Badge & webhook triển khai tự động.

---

© 2026 **Fortress Investment Holdings**. All Rights Reserved.
