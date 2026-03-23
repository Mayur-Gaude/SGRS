import ComplaintTimeline from "../models/complaintTimeline.model.js";

export const createTimelineEntry = async ({
    complaint_id,
    action,
    description,
    performed_by,
    role,
}) => {
    try {
        await ComplaintTimeline.create({
            complaint_id,
            action,
            description,
            performed_by,
            role,
        });
    } catch (error) {
        console.error("Timeline creation failed:", error.message);
    }
};