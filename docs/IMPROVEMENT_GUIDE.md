# Hướng Dẫn Cải Thiện Chuyên Sâu — `langding` (AXVN Tech Holding)

> **Cập nhật:** 2025-08 (Revision 2) | **Dựa trên đánh giá:** Mô hình 7 Domain (ISO 31000 × NIST CSF)

---

## 📦 TÓM TẮT TẤT CẢ CÁC FIX ĐÃ ĐƯỢC THỰC THI

| # | File | Vấn đề | Fix | Revision |
|---|---|---|---|---|
| 1 | `src/app/api/shareholders/auth/route.ts` | Không có rate limit — brute-force được | Rate limit 5/min + progressive lockout + clearOnSuccess | R1 |
| 2 | `src/lib/sse-broker.ts` | N timers per connection → memory/CPU leak | 1 global timer duy nhất `.unref()` | R1 |
| 3 | `src/app/api/admin/events/sse/route.ts` | Per-connection `setInterval(heartbeat)` | Loại bỏ timer local, dùng global timer | R1 |
| 4 | `src/app/api/shareholders/messages/sse/route.ts` | Per-connection `setInterval(heartbeat)` | Loại bỏ timer local, dùng global timer | R1 |
| 5 | `ecosystem.config.js` | `cluster` mode → SSE broker + rate limiter broken; tên `fortress-website` | Fork mode, `instances: 1`, rename → `langding` | R1+R2 |
| 6 | `scripts/deploy.sh` | `--no-audit` bypass security scan; PM2 tên sai | Bỏ `--no-audit`, thêm `npm audit`, fix PM2 name | R1+R2 |
| 7 | `scripts/verify.sh` | Không có security audit trong pipeline | Thêm `npm audit` bước 1/5 | R1 |
| 8 | `src/services/shareholder.service.ts` | Default password `"fortress2026!"` là known value | Throw error khi không có password | R1 |
| 9 | `src/services/settings.service.ts` | Defaults còn "Fortress", phone Dubai hardcode | Rebrand → AXVN, phone/address để trống | R1 |
| 10 | `src/lib/email.ts` | Fallback from address còn fortressih.com | Đổi → `noreply@vnkr.vn` | R1 |
| 11 | `.env.example` | `ADMIN_PASSWORD=123456`, tên Fortress, WA token hardcode, env var sai tên | Strong placeholders, rebrand AXVN, thêm analytics section | R1+R2 |
| 12 | `src/app/api/admin/documents/route.ts` | POST không dùng Zod validator | Thêm `documentSchema.safeParse()` | R1 |
| 13 | `src/app/api/health/route.ts` | Không có health check endpoint | Tạo mới `/api/health` với DB ping | R1 |
| 14 | `middleware.ts` | `sh_session` chỉ check presence; `Buffer.from` không dùng được trong Edge | Thêm `verifyShareholderCookie()` HMAC+exp; thay Buffer → atob | R1+R2 |
| 15 | `src/lib/env.ts` | Thiếu `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Thêm optional fields | R1 |
| 16 | `src/app/layout.tsx` | GA/Pixel script inject dù ID là placeholder | Conditional render chỉ khi có ID thực | R1 |
| 17 | `src/app/api/admin-login/route.ts` | Fallback login dùng `===` (timing attack) | Rate limit + generic error | R1 |
| 18 | `src/validators/index.ts` | `contactEnquirySchema` thiếu consent | Thêm `consentGiven` (literal true), `consentTimestamp` | R1+R2 |
| 19 | `src/models/Enquiry.ts` | Không lưu consent | Thêm `consentGiven`, `consentTimestamp` fields | R1+R2 |
| 20 | `src/models/Settings.ts` | Defaults còn "Fortress" | Rebrand → AXVN | R1 |
| 21 | `package.json` | `name: "fortress-website"` | Đổi → `"AXVN-langding"` | R1+R2 |
| 22 | `src/app/api/admin/ai/route.ts` | System prompt còn "Fortress" | Rebrand → AXVN Tech Holding | R1 |
| 23 | `scripts/check-env.sh` | Check `NEXT_PUBLIC_APP_URL` (sai tên) | Fix → `NEXT_PUBLIC_SITE_URL` + thêm `SESSION_SECRET` | R1 |
| 24 | `scripts/backup.sh` | Paths "fortress", thiếu offsite sync, thiếu log file | Rebrand → AXVN, thêm S3 offsite block, thêm ghi log | R2 |
| 25 | `.github/workflows/ci.yml` | Chưa có CI workflow | Thêm GitHub Actions: audit + lint + typecheck + build | R2 |

---

## 🔴 VIỆC CẦN LÀM TIẾP (CHƯA TỰ ĐỘNG HÓA)

### 1. Setup UptimeRobot / Betterstack (Ngay, miễn phí)

1. Đăng ký tại [uptimerobot.com](https://uptimerobot.com) (free tier: 50 monitors, 5 min interval)
2. Thêm monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://vnkr.vn/api/health`
   - **Interval:** 5 phút
   - **Alert:** Email + Telegram
3. Monitor thêm: `https://vnkr.vn` (homepage)

### 2. Thêm MFA TOTP cho Admin Portal (Q4 2025)

Recommended library: `otplib` (TOTP RFC 6238)

```bash
npm install otplib qrcode
```

Flow:
1. Admin setup: `GET /api/admin/mfa/setup` → trả về QR code base64
2. Admin verify: `POST /api/admin/mfa/verify` với TOTP code
3. Sau verify thành công: set `mfaEnabled: true` trong Admin model
4. Login flow: sau bcrypt pass → check `mfaEnabled` → nếu true, yêu cầu TOTP code

```typescript
// src/models/Admin.ts — thêm fields
mfaEnabled: { type: Boolean, default: false },
mfaSecret: { type: String, select: false, default: "" },
```

### 3. KYC Fields cho Shareholder (Q4 2025 – Q1 2026)

Cần thêm vào [`src/models/Shareholder.ts`](../src/models/Shareholder.ts):

```typescript
// KYC fields theo NQ05/2025 và Luật AML Việt Nam
kycStatus: { type: String, enum: ["not_started", "pending", "approved", "rejected"], default: "not_started" },
kycSubmittedAt: { type: Date, default: null },
kycApprovedAt: { type: Date, default: null },
nationalId: { type: String, select: false, default: "" },        // CMND/CCCD (mã hóa AES-256-GCM)
nationalIdIssuedDate: { type: Date, default: null },
nationalIdIssuedPlace: { type: String, default: "" },
permanentAddress: { type: String, default: "" },
sourceOfFunds: { type: String, default: "" },                     // Nguồn vốn
isPEP: { type: Boolean, default: false },                        // Politically Exposed Person
isSanctioned: { type: Boolean, default: false },                 // Danh sách cấm vận
```

**Quan trọng:** `nationalId` phải được **mã hóa tại rest** (AES-256-GCM) — không lưu plaintext.

### 4. Redis Adapter cho Scale Ngang (Khi cần > 1 instance)

Khi traffic tăng cần scale lên nhiều instance, thực hiện theo thứ tự:

**Bước 1:** Cài Redis (local hoặc Upstash)
```bash
docker run -d -p 6379:6379 redis:7-alpine
# Hoặc Upstash (serverless, free tier): https://upstash.com
```

**Bước 2:** Thay SSE broker in-process bằng Redis pub/sub
```bash
npm install ioredis
```

```typescript
// src/lib/sse-broker.redis.ts
import Redis from "ioredis";
const publisher  = new Redis(process.env.REDIS_URL!);
const subscriber = new Redis(process.env.REDIS_URL!);

export function broadcast(room: string, event: string, data: unknown): void {
  publisher.publish(`sse:${room}`, JSON.stringify({ event, data }));
}

subscriber.psubscribe("sse:*");
subscriber.on("pmessage", (_pattern, channel, message) => {
  const room = channel.replace("sse:", "");
  const { event, data } = JSON.parse(message);
  broadcastLocal(room, event, data);
});
```

**Bước 3:** Thay rate limiter in-process bằng Redis ZSET
```typescript
// src/utils/rate-limit.redis.ts — sliding window bằng Redis ZSET
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimitRedis(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, "-inf", windowStart);
  pipe.zadd(key, now, `${now}-${Math.random()}`);
  pipe.zcard(key);
  pipe.pexpire(key, windowMs);
  const results = await pipe.exec();
  const count = results?.[2]?.[1] as number;
  return { allowed: count <= limit, count, resetAt: now + windowMs };
}
```

**Bước 4:** Đổi lại `ecosystem.config.js` sang cluster
```js
instances: "max",
exec_mode: "cluster",
```

### 5. Fix ESLint nếu còn warning (Ongoing)

File [`eslint.config.mjs`](../eslint.config.mjs) hiện đã được cập nhật đúng `FlatCompat`.
Nếu CI báo lint error, chạy:
```bash
npm run lint -- --fix
```

---

## 🔧 HƯỚNG DẪN THÊM ANALYTICS IDs

Khi đã có Google Analytics ID và Meta Pixel ID thực:

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      # từ analytics.google.com
NEXT_PUBLIC_META_PIXEL_ID=123456789 # từ Meta Business Manager
```

Scripts sẽ tự động inject sau khi restart server.

---

## 📊 TRẠNG THÁI RỦI RO SAU CÁC FIX (Revision 2)

| Domain | Baseline | Sau R1 | Sau R2 | Ghi chú |
|--------|----------|--------|--------|---------|
| 1. Quản trị | 5.5 | 5.0 | **4.5** | CI workflow thêm; package name AXVN |
| 2. Tài sản | 6.5 | 4.5 | **4.0** | .env.example hoàn toàn sạch, backup offsite |
| 3. Bảo mật | 6.0 | 4.0 | **3.5** | SH auth rate limit; middleware HMAC verify |
| 4. Lỗ hổng | 5.0 | 3.5 | **3.5** | npm audit pipeline ổn định |
| 5. Ứng phó | 6.7 | 5.5 | **5.5** | INCIDENT_RESPONSE.md đầy đủ |
| 6. Chuỗi cung ứng | 4.5 | 4.5 | **4.5** | Không thay đổi |
| 7. Tuân thủ | 7.0 | 6.0 | **5.5** | Consent bắt buộc trong enquiry form |

---

## 🗺️ ROADMAP DÀI HẠN

```
Q3 2025 (Đã xong — Revision 1):
  ✅ Rebrand Fortress → AXVN toàn bộ codebase
  ✅ Rate limit shareholder auth
  ✅ Fix SSE global heartbeat
  ✅ PM2 fork mode (instances: 1)
  ✅ npm audit pipeline trong verify.sh
  ✅ Health check endpoint /api/health
  ✅ HMAC verify sh_session middleware
  ✅ Consent fields cho PII enquiry
  ✅ Incident Response Playbook (INCIDENT_RESPONSE.md)

Q3 2025 (Revision 2 — Session này):
  ✅ ecosystem.config.js: rename + fork mode confirmed
  ✅ .env.example: hoàn toàn sạch, không còn hardcode secret
  ✅ package.json: name → AXVN-langding
  ✅ scripts/backup.sh: paths AXVN + offsite S3 block + log
  ✅ scripts/deploy.sh: --no-audit removed, npm audit added, PM2 name fixed
  ✅ contactEnquirySchema: consentGiven (z.literal(true)) + consentTimestamp
  ✅ Enquiry model: consentGiven + consentTimestamp fields
  ✅ shareholders/auth: rate limit 5/min + progressive lockout
  ✅ middleware.ts: verifyShareholderCookie HMAC+exp; atob thay Buffer (Edge-safe)
  ✅ GitHub Actions ci.yml: audit + lint + typecheck + build (Node 20.x / 22.x)

Q4 2025:
  □ UptimeRobot / Betterstack monitoring
  □ MFA TOTP admin (otplib)
  □ KYC fields Shareholder model

Q1 2026 (Pre-NQ05 filing):
  □ AML/KYC third-party integration
  □ Penetration test
  □ Data encryption at rest cho nationalId (AES-256-GCM)
  □ Audit log retention 7 năm cho capital events
  □ Legal review toàn bộ website content

Q2 2026 (Scale):
  □ Redis pub/sub cho SSE broker
  □ Redis rate limiter (ZSET sliding window)
  □ PM2 cluster mode sau khi có Redis
  □ Read replica MongoDB
  □ CDN static assets
```

---

## 🧪 KIỂM TRA SAU KHI DEPLOY

```bash
# 1. Health check
curl https://vnkr.vn/api/health
# Expected: {"status":"ok","db":"connected","uptime":...}

# 2. Rate limit test (shareholder)
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://vnkr.vn/api/shareholders/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Expected: 401 × 5, 429 × 1

# 3. Rate limit test (admin login)
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://vnkr.vn/api/admin-login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}'
done
# Expected: 401 × 5, 429 × 1

# 4. Verify PM2 fork mode
pm2 show langding | grep exec_mode
# Expected: fork_mode

# 5. Verify npm audit passes
npm audit --audit-level=high
# Expected: 0 high/critical vulnerabilities

# 6. Verify backup paths
bash scripts/backup.sh
# Expected: /var/backups/AXVN/AXVN_YYYYMMDD_HHMMSS.gz
```
