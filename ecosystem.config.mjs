/**
 * PM2 Ecosystem Configuration
 * @see https://pm2.keymetrics.io/docs/usage/application-declaration/
 */
const config = {
  apps: [
    {
      name: 'quiz.tools',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8090,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      // Graceful shutdown and reload
      kill_timeout: 3000,
      wait_ready: true,
      // Error handling
      max_restarts: 10,
      min_uptime: '10s',
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      time: true,
      // Cluster behavior
      autorestart: true,
      exp_backoff_restart_delay: 100,
      // System resource management
      node_args: '--max-old-space-size=1536',
    },
  ],
};

export default config;
