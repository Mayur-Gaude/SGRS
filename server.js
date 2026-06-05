//server.js
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';
import app from './src/app.js';
import { startAllJobs } from './src/jobs/index.js';


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    startAllJobs(); // start cron jobs
});