import dotenv from 'dotenv';

dotenv.config();

const siteName = process.env.PROJECT_NAME || 'quiz.tools';

const ecosystem = {
	apps: [
		{
			name: siteName,
			script: 'npm',
			args: 'start',
			cwd: '/',
			instances: 'max',
			exec_mode: 'cluster',
			autorestart: true,
			watch: '.',
			log_date_format: 'YYYY-MM-DD HH:mm Z',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};

export default ecosystem;
