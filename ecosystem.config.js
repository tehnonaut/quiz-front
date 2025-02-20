module.exports = {
    apps: [{
      name: 'quiz.tools',   
      script: 'npm',
      args: 'start',
      cwd: '/',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: 'production',
      },
    }],
  };