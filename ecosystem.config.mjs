const ecosystem = {
  apps: [
    {
      name: "quiz.tools",
      script: "npx next start",
      args: "start",
      cwd: "/",          
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

export default ecosystem;
