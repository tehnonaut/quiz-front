import dotenv from 'dotenv';
dotenv.config();

const siteName = process.env.PROJECT_NAME || 'Web Site';

const Config = 
    {
        apps: [
            {
                name: siteName,
                script: 'dist/app.js',
                log_date_format: 'YYYY-MM-DD HH:mm Z',
            },
        ],
    }    

export default Config;