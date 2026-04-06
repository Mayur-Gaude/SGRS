import { createTimelineEntry } from "../utils/timeline.util.js";

export const calculateSLA = (category) => {
    const now = new Date();

    const responseDeadline = new Date(
        now.getTime() + category.sla_response_hours * 60 * 60 * 1000
    );

    const resolutionDeadline = new Date(
        now.getTime() + category.sla_resolution_hours * 60 * 60 * 1000
    );

    return {
        responseDeadline,
        resolutionDeadline,
    };
};



export const evaluateSLA = async (complaint) => {
    const now = new Date();

    let escalated = false;

    // RESPONSE SLA
    if (
        complaint.sla_response_deadline &&
        !complaint.sla_response_met
    ) {
        if (now <= complaint.sla_response_deadline) {
            complaint.sla_response_met = true;
        } else if (!complaint.is_escalated) {
            complaint.is_escalated = true;
            complaint.escalation_level =
                (complaint.escalation_level || 0) + 1;

            escalated = true;
        }
    }

    // RESOLUTION SLA
    if (
        complaint.sla_resolution_deadline &&
        !complaint.sla_resolution_met
    ) {
        if (now <= complaint.sla_resolution_deadline) {
            complaint.sla_resolution_met = true;
        } else if (!complaint.is_escalated) {
            complaint.is_escalated = true;
            complaint.escalation_level =
                (complaint.escalation_level || 0) + 1;

            escalated = true;
        }
    }

    // 🔥 Add timeline entry if escalated
    if (escalated) {
        await createTimelineEntry({
            complaint_id: complaint._id,
            action: "ESCALATED",
            description: "SLA breached, complaint escalated",
            performed_by: null,
            role: "SYSTEM",
        });
    }

    return complaint;
};