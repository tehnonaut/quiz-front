const dotenv = require('dotenv');

dotenv.config();

const siteName = process.env.PROJECT_NAME || 'quiz.tools';



const ecosystem = {
	apps: [
		{
			name: siteName,
			script: 'npm run start',
			args: '',
			cwd: './',
			exec_mode: 'fork',
			autorestart: true,
			watch: '.', 
			log_date_format: 'YYYY-MM-DD HH:mm Z',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};

module.exports = ecosystem;
