module.exports = {
  apps: [
    {
      name: "fortress-website",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/fortress/app",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      kill_timeout: 30000,
      listen_timeout: 10000,
      out_file: "/var/log/pm2/fortress-out.log",
      err_file: "/var/log/pm2/fortress-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
