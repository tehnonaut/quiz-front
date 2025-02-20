const ecosystem = {
  apps: [
    {
      name: "quiz.tools",
      script: "npm",
      args: "start",
      cwd: "/",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

export default ecosystem;
