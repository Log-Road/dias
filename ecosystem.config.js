const { configDotenv } = require("dotenv");

configDotenv({
  path: process.env.NODE_ENV === "prod" ? "./.env" : "./.env.dev",
});

module.exports = {
  apps: [
    {
      name: "dauth",
      script: "dist/main.js",
      watch: true,
      ignore_watch: ["logs", "node_modules", "*.log"],
      instance: 2,
      exec_mode: "cluster",
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      max_memory_restart: "300M",
      error_file: "error.log",
      env_prod: {
        NODE_ENV: "prod",
      },
    },
  ],
  deploy: {
    production: {
      user: process.env.AWS_USER,
      host: process.env.AWS_HOST,
      ref: "origin/prod",
      repo: "https://github.com/log-road/dauth.git",
      path: "./",
      "post-setup": "pnpm i && nest build",
      "post-deploy": "pnpm prod",
    },
  },
};
