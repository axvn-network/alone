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

const env = loadEnv(path.join(__dirname, ".env.local"));

module.exports = {
  apps: [
    {
      name: "gvi-langding",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/lkvip/langding",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      kill_timeout: 30000,
      listen_timeout: 10000,
      out_file: "/var/log/pm2/gvi-out.log",
      err_file: "/var/log/pm2/gvi-err.log",
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
