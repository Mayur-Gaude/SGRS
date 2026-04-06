import cron from "node-cron";
import Complaint from "../models/complaint.model.js";
import { createTimelineEntry } from "../utils/timeline.util.js";

const runSLAOnce = async () => {
    console.log("⏰ Running SLA Check Job...");

    const now = new Date();

    const complaints = await Complaint.find({
        status: { $in: ["SUBMITTED", "UNDER_REVIEW"] },
    });

    for (const c of complaints) {
        let escalated = false;

        // Response SLA breach
        if (
            c.sla_response_deadline &&
            now > c.sla_response_deadline &&
            !c.sla_response_met
        ) {
            escalated = true;
        }

        // Resolution SLA breach
        if (
            c.sla_resolution_deadline &&
            now > c.sla_resolution_deadline &&
            !c.sla_resolution_met
        ) {
            escalated = true;
        }

        if (escalated && !c.is_escalated) {
            c.is_escalated = true;
            c.escalation_level += 1;

            await c.save();

            await createTimelineEntry({
                complaint_id: c._id,
                action: "AUTO_ESCALATED",
                description: "System detected SLA breach",
                performed_by: null,
                role: "SYSTEM",
            });
        }
    }

    console.log("✅ SLA Check Completed");
};

export const startSLAJob = () => {

    // Run once on startup so logs appear immediately after server starts.
    runSLAOnce().catch((error) => {
        console.error("❌ SLA Check Failed:", error?.message || error);
    });

    // Runs every hour
    cron.schedule("0 * * * *", async () => {
        try {
            await runSLAOnce();
        } catch (error) {
            console.error("❌ SLA Check Failed:", error?.message || error);
        }
    });
};