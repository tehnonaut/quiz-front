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
      }
    }
  ]
};

export default config;