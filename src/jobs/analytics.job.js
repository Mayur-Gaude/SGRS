import cron from "node-cron";
import Department from "../models/department.model.js";
import { generateAnalyticsReport } from "../services/analytics.service.js";

export const startAnalyticsJob = () => {

    // Runs every day at 12:00 AM
    cron.schedule("0 0 * * *", async () => {
        console.log("📊 Running Daily Analytics Job...");

        const departments = await Department.find({ is_active: true });

        for (const dept of departments) {
            try {
                await generateAnalyticsReport({
                    departmentId: dept._id,
                    report_period: "DAILY",
                    generated_by: null, // system
                });
            } catch (err) {
                console.error("Analytics Job Error:", err.message);
            }
        }

        console.log("✅ Daily Analytics Completed");
    });
};