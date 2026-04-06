import ReopenRequest from "../../models/reopenRequest.model.js";
import Complaint from "../../models/complaint.model.js";
import { createTimelineEntry } from "../../utils/timeline.util.js";


// 🟢 Citizen → Request Reopen
export const requestReopen = async (
    complaintId,
    reason,
    currentUser
) => {

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
        throw new Error("Complaint not found");
    }

    // Only owner can reopen
    if (complaint.user_id.toString() !== currentUser._id.toString()) {
        throw new Error("Unauthorized");
    }

    // Only after resolved/closed
    if (!["RESOLVED", "CLOSED"].includes(complaint.status)) {
        throw new Error("Reopen allowed only after resolution");
    }

    const reopen = await ReopenRequest.create({
        complaint_id: complaintId,
        user_id: currentUser._id,
        reason,
    });

    await createTimelineEntry({
        complaint_id: complaint._id,
        action: "REOPEN_REQUESTED",
        description: reason,
        performed_by: currentUser._id,
        role: currentUser.role,
    });

    return reopen;
};


// 🔵 Admin → Review Reopen
export const reviewReopenRequest = async (
    reopenId,
    decision,
    currentUser
) => {

    const reopen = await ReopenRequest.findById(reopenId);

    if (!reopen) {
        throw new Error("Reopen request not found");
    }

    if (reopen.status !== "PENDING") {
        throw new Error("Already reviewed");
    }

    const complaint = await Complaint.findById(reopen.complaint_id);

    // Ensure admin is assigned
    if (
        complaint.assigned_admin_id?.toString() !==
        currentUser._id.toString()
    ) {
        throw new Error("Unauthorized");
    }

    // Update reopen request
    reopen.status = decision;
    reopen.reviewed_by = currentUser._id;
    reopen.reviewed_at = new Date();

    await reopen.save();

    if (decision === "APPROVED") {
        complaint.status = "REOPENED";
        complaint.reopen_count += 1;

        await complaint.save();

        await createTimelineEntry({
            complaint_id: complaint._id,
            action: "REOPEN_APPROVED",
            description: "Complaint reopened",
            performed_by: currentUser._id,
            role: currentUser.role,
        });

    } else {
        await createTimelineEntry({
            complaint_id: complaint._id,
            action: "REOPEN_REJECTED",
            description: "Reopen request rejected",
            performed_by: currentUser._id,
            role: currentUser.role,
        });
    }

    return reopen;
};