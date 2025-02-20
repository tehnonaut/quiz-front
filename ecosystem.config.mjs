export default {
  apps: [
    {
      name: "quiz.tools",
      script: "node dist/app.js",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8090,
      },
    },
  ],
};
