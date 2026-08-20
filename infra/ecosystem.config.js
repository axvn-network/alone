// =============================================================================
// infra/ecosystem.config.js — PM2 Process Manager Config
//
// Chạy:
//   pm2 start infra/ecosystem.config.js --env production
//   pm2 reload infra/ecosystem.config.js --env production --update-env
//
// Lưu ý:
//   - Fork mode (instances: 1) bắt buộc vì SSE broker in-memory
//   - Khi cần scale ngang → triển khai Redis adapter trước, rồi đổi cluster mode
// =============================================================================
const fs = require("fs");
const path = require("path");

/**
 * Đọc và parse .env.local an toàn (không dùng xargs để tránh lỗi với giá trị có khoảng trắng/ký tự đặc biệt)
 */
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  return raw
    .split("\n")
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return acc;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) return acc;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim()
        .replace(/^["'](.*)["']$/, "$1"); // strip surrounding quotes
      if (key) acc[key] = val;
      return acc;
    }, {});
}

// ecosystem.config.js nằm trong infra/ — .env.local ở thư mục gốc app (1 level up)
const env = loadEnv(path.join(__dirname, "..", ".env.local"));

module.exports = {
  apps: [
    {
      name: "AXVN-langding",

      // Next.js standalone output (yêu cầu output: "standalone" trong next.config.ts)
      script: ".next/standalone/server.js",
      cwd: "/var/lkvip/langding",

      // ── Process mode ──────────────────────────────────────────────────────
      // fork — bắt buộc khi dùng SSE in-memory broker (sse-broker.ts)
      // Đổi sang cluster + instances: "max" CHỈ sau khi triển khai Redis pub/sub adapter
      instances: 1,
      exec_mode: "fork",

      // ── Run as non-root system user ────────────────────────────────────────
      // NOTE: Process runs as "axvn" user via systemd pm2-axvn.service
      // PM2_HOME=/var/lkvip/.pm2-axvn  —  managed by su -s /bin/bash axvn
      // Root PM2 daemon manages n8n only; AXVN-langding uses separate axvn daemon

      // ── Stability ─────────────────────────────────────────────────────────
      watch: false,                // không watch files trong production
      max_memory_restart: "500M",  // tự restart khi vượt 500MB RAM
      kill_timeout: 30000,         // chờ tối đa 30s trước khi SIGKILL
      listen_timeout: 15000,       // chờ tối đa 15s để port lắng nghe
      restart_delay: 2000,         // chờ 2s giữa các lần restart
      max_restarts: 10,            // số lần restart tối đa trong 1 cửa sổ thời gian
      min_uptime: "30s",           // app phải up ít nhất 30s mới được coi là stable

      // ── Logging ───────────────────────────────────────────────────────────
      out_file: "/var/log/pm2/AXVN-out.log",
      err_file: "/var/log/pm2/AXVN-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // ── Environment ───────────────────────────────────────────────────────
      env_production: {
        ...env,
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",  // chỉ lắng nghe localhost — Nginx làm reverse proxy
      },
    },
  ],
};
