//complaintResolution.service.js
import Complaint from "../../models/complaint.model.js";
import { createTimelineEntry } from "../../utils/timeline.util.js";
import { evaluateSLA } from "../../services/sla.service.js";

export const resolveComplaint = async (
    complaintId,
    resolutionRemark,
    currentUser
) => {

    if (currentUser.role !== "DEPT_ADMIN") {
        throw new Error("Only department admins can resolve complaints");
    }

    let complaint = await Complaint.findById(complaintId);

    if (!complaint) {
        throw new Error("Complaint not found");
    }

    // Ensure admin is assigned
    if (
        complaint.assigned_admin_id?.toString() !==
        currentUser._id.toString()
    ) {
        throw new Error("Unauthorized: Not assigned to this complaint");
    }

    // Optional: Only allow resolving from valid states
    const allowedStates = ["UNDER_REVIEW", "IN_PROGRESS"];

    if (!allowedStates.includes(complaint.status)) {
        throw new Error("Complaint cannot be resolved from current status");
    }

    // Update complaint
    complaint.status = "RESOLVED";
    complaint.resolution_remarks = resolutionRemark;
    complaint.resolved_by = currentUser._id;
    complaint.resolved_at = new Date();

    complaint = await evaluateSLA(complaint); // Update SLA status based on resolution time
    await complaint.save();

    // Timeline entry
    await createTimelineEntry({
        complaint_id: complaint._id,
        action: "RESOLVED",
        description: resolutionRemark,
        performed_by: currentUser._id,
        role: currentUser.role,
    });

    return complaint;
};