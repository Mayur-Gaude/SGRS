import { startAnalyticsJob } from "./analytics.job.js";
import { startSLAJob } from "./sla.job.js";

export const startAllJobs = () => {
    startAnalyticsJob();
    startSLAJob();
};