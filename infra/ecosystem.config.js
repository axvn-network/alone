// Load env từ .env.local để inject vào PM2 process
const fs = require("fs");
const path = require("path");

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return fs.readFileSync(filePath, "utf8")
    .split("\n")
    .filter(l => l.trim() && !l.startsWith("#"))
    .reduce((acc, l) => {
      const [k, ...v] = l.split("=");
      if (k) acc[k.trim()] = v.join("=").trim();
      return acc;
    }, {});
}

// ecosystem.config.js lives in infra/ — .env.local is one level up (app root)
const env = loadEnv(path.join(__dirname, "..", ".env.local"));

module.exports = {
  apps: [
    {
      name: "AXVN-langding",
      script: ".next/standalone/server.js",
      args: "",
      cwd: "/var/lkvip/langding",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "500M",
      kill_timeout: 30000,
      listen_timeout: 10000,
      out_file: "/var/log/pm2/AXVN-out.log",
      err_file: "/var/log/pm2/AXVN-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env_production: {
        ...env,
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
