# Troubleshooting Guide — AXVN Tech Holding Langding

> Tài liệu này xử lý các lỗi thường gặp trong quá trình phát triển và vận hành.
> Mọi incident nghiêm trọng → xem [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md).

---

## 1. MongoDB / Database

### Lỗi kết nối
```bash
# Kiểm tra MONGODB_URI
grep MONGODB_URI .env.local

# Test kết nối trực tiếp
mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')"
```
- Đảm bảo IP server đã được whitelist trong MongoDB Atlas Network Access
- Kiểm tra định dạng URI: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Dữ liệu gói đầu tư trống (sau first-time setup)
```bash
npm run seed:plans
# hoặc
make seed-plans
```
> Chỉ dùng với database trống. Dùng `--force` để override nếu có sẵn dữ liệu.

### Migration schema
Repository không có migration framework độc lập. Quy trình thủ công:
1. Backup database: `bash scripts/backup.sh`
2. Viết migration script vào `scripts/archived/migrate-YYYYMMDD.ts`
3. Chạy với `npx tsx` sau khi review kỹ
4. Verify kết quả

### MongoDB connection pool exhausted
```bash
# Kiểm tra số connections hiện tại qua Atlas → Metrics → Connections
# Nếu bị exhausted: restart app để release connections
pm2 restart AXVN-langding

# Kiểm tra code: mỗi request phải dùng connectDB() singleton, không new mongoose.connect()
grep -r "mongoose.connect" src/
# Chỉ nên có 1 kết quả trong src/lib/db.ts
```

---

## 2. Realtime (SSE)

### SSE không nhận tin nhắn
1. Kiểm tra `lib/sse-broker.ts` — pub/sub có hoạt động không
2. Nginx phải có cấu hình sau trong `location /` block:
```nginx
proxy_buffering       off;
proxy_cache           off;
proxy_set_header      Connection        "upgrade";
proxy_http_version    1.1;
```
3. Kiểm tra browser không block SSE (DevTools → Network → Filter: EventSource)
4. Không dùng PM2 cluster mode — SSE broker in-memory chỉ hoạt động với `fork` mode

### SSE connections piling up / memory leak
```bash
# Kiểm tra số connections trong logs
pm2 logs AXVN-langding --lines 100 | grep -i sse

# Xem src/lib/sse-broker.ts — phải có 1 global timer duy nhất
# Không được có setInterval trong mỗi connection handler
grep -n "setInterval" src/lib/sse-broker.ts src/app/api/admin/events/sse/route.ts
```

### SSE hoạt động local nhưng không hoạt động production
- Kiểm tra Nginx `proxy_read_timeout` — phải ≥ 120s
- Nếu dùng Cloudflare: Enterprise plan hỗ trợ SSE tốt hơn; Free plan có thể timeout

---

## 3. Deploy / Build

### Build thất bại
```bash
# Kiểm tra TypeScript trước
npx tsc --noEmit --pretty false

# Xem lỗi build chi tiết
npm run build 2>&1 | tail -30
```

### PM2 reload không thành công
```bash
# Xem logs chi tiết
pm2 logs AXVN-langding --lines 200

# Kiểm tra env vars đầy đủ chưa
bash scripts/check-env.sh

# Kiểm tra standalone output tồn tại
ls -la .next/standalone/server.js

# Kiểm tra static assets đã được copy chưa
ls -la .next/standalone/.next/static/
ls -la .next/standalone/public/
```

### "Another build is already running"
```bash
# Xóa Turbopack build lock
rm -rf .next/build 2>/dev/null || true
npm run build
```

### Next.js standalone không start được
```bash
# Test chạy trực tiếp (không qua PM2)
cd /var/lkvip/langding
NODE_ENV=production PORT=3000 node .next/standalone/server.js

# Nếu có lỗi module not found → npm ci lại
npm ci --omit=dev
```

### TypeScript errors sau khi thêm package mới
```bash
# Regenerate types
npm run build          # build trước để tạo .next/types
npx tsc --noEmit       # sau đó check
```

---

## 4. PM2

### Process không start / crash loop
```bash
# Xem crash logs
pm2 logs AXVN-langding --err --lines 100

# Xem ecosystem config
cat infra/ecosystem.config.js

# Start lại từ ecosystem
pm2 delete AXVN-langding
pm2 start infra/ecosystem.config.js --env production
pm2 save
```

### PM2 không tự start sau reboot
```bash
# Cấu hình lại startup
pm2 startup
# Chạy lệnh mà pm2 startup in ra, ví dụ:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

### PM2 log quá lớn
```bash
# Xem size logs hiện tại
ls -lh /var/log/pm2/

# Flush logs
pm2 flush AXVN-langding

# Kiểm tra pm2-logrotate đã được setup chưa
pm2 show pm2-logrotate
# Nếu chưa: make pm2-setup
```

### Memory restart loop (max_memory_restart)
```bash
# Xem memory usage
pm2 show AXVN-langding | grep memory

# Tạm tăng limit để debug
pm2 restart AXVN-langding --max-memory-restart 1G

# Kiểm tra memory leak: SSE connections không cleanup, rate limiter in-memory tích tụ
# Xem sse-broker.ts — global timer phải có .unref()
```

---

## 5. Nginx

### 502 Bad Gateway
```bash
# App có đang chạy không?
pm2 status

# App có lắng nghe port 3000 không?
ss -tlnp | grep 3000
# hoặc
netstat -tlnp | grep 3000

# Kiểm tra Nginx config
nginx -t
```

### SSL cert lỗi / expired
```bash
# Kiểm tra expiry
openssl x509 -enddate -noout -in /etc/letsencrypt/live/vnkr.vn/fullchain.pem

# Renew
certbot renew --nginx
systemctl reload nginx
```

### Nginx không reload (config syntax error)
```bash
# Kiểm tra lỗi
nginx -t

# Xem logs
journalctl -u nginx -n 30
tail -n 30 /var/log/nginx/error.log
```

---

## 6. Authentication / Session

### Admin login redirect loop
```bash
# Kiểm tra SESSION_SECRET đã set chưa
grep SESSION_SECRET .env.local

# SESSION_SECRET phải ≥ 64 hex chars
openssl rand -hex 64  # tạo mới nếu cần
```

### Shareholder cookie không hợp lệ
```bash
# Kiểm tra middleware.ts có verifyShareholderCookie không
grep "verifyShareholderCookie" src/middleware.ts

# Kiểm tra SESSION_SECRET khớp giữa lúc tạo cookie và verify
# Nếu đã đổi SESSION_SECRET → tất cả sessions cũ sẽ invalid (expected behavior)
```

### CSRF token error (403 Forbidden)
- Client phải gọi `GET /api/csrf` trước để lấy token
- Gửi token trong header `x-csrf-token` với mỗi mutation request
- CSRF token expire sau session timeout (8h)

### MFA loop (không qua được login)
```bash
# Emergency: disable MFA cho admin qua DB trực tiếp
# (chỉ dùng khi mất access hoàn toàn)
mongosh "$MONGODB_URI" --eval "
  db.admins.updateOne(
    { email: 'admin@vnkr.vn' },
    { \$set: { mfaEnabled: false, mfaRequiredForLogin: false } }
  )
"
```

---

## 7. AI / Anthropic Claude

### AI không phản hồi
1. Kiểm tra `ANTHROPIC_API_KEY` trong `.env.local`
2. Kiểm tra billing + quota tại [console.anthropic.com](https://console.anthropic.com)
3. Kiểm tra logs: `pm2 logs AXVN-langding --lines 30 | grep -i anthropic`

---

## 8. Cloudinary / Media

### Upload thất bại
```bash
# Kiểm tra Cloudinary credentials
grep CLOUDINARY .env.local

# Test upload thủ công (nếu cần)
# Xem logs upload: pm2 logs AXVN-langding | grep -i cloudinary
```

### Ảnh không load (404)
- Kiểm tra folder namespace: phải là `AXVN/` (không còn `fortress/`)
- Kiểm tra URL trong DB: `db.uploads.find({}).limit(5)`

---

## 9. Email (SMTP / Nodemailer)

### Email không gửi được
```bash
# Kiểm tra SMTP config
grep SMTP .env.local

# Test kết nối SMTP
telnet $SMTP_HOST $SMTP_PORT

# Kiểm tra logs
pm2 logs AXVN-langding --lines 30 | grep -i smtp
```

---

## 10. Environment / Config

### Biến env không được load
```bash
# Validate tất cả biến bắt buộc
bash scripts/check-env.sh
# hoặc
make env-check
```

### Permission denied khi chạy scripts
```bash
chmod +x scripts/*.sh
chmod +x infra/lkvip_holding/scripts/*.sh
```

### node_modules missing hoặc corrupt
```bash
rm -rf node_modules
npm ci
```

### ESLint crash (FlatCompat circular JSON)
```bash
# Kiểm tra eslint.config.mjs
cat eslint.config.mjs

# Chạy lint với debug
DEBUG=eslint:* npm run lint 2>&1 | head -30
```

---

## 11. Security Alerts

### Rate limit 429 Too Many Requests (giả)
- Đây là behavior đúng — rate limiter in-memory
- Nếu bị false positive: kiểm tra IP header qua Cloudflare proxy
  ```bash
  # Nginx cần forward X-Real-IP đúng
  grep "X-Real-IP" /etc/nginx/sites-available/langding.conf
  ```

### npm audit warnings
```bash
# Xem chi tiết vulnerabilities
npm audit

# Fix tự động (cẩn thận với breaking changes)
npm audit fix

# Fix forced (chỉ dùng khi hiểu rõ impact)
npm audit fix --force
```

---

*Xem thêm: [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) cho P0/P1 incidents · [IMPROVEMENT_GUIDE.md](IMPROVEMENT_GUIDE.md) cho roadmap bảo mật*
