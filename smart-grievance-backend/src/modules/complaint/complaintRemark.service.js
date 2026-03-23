import Complaint from "../../models/complaint.model.js";
import { createTimelineEntry } from "../../utils/timeline.util.js";

export const addAdminRemark = async (
    complaintId,
    remark,
    currentUser
) => {

    if (currentUser.role !== "DEPT_ADMIN") {
        throw new Error("Only department admins can add remarks");
    }

    const complaint = await Complaint.findById(complaintId);

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

    // Add timeline entry
    await createTimelineEntry({
        complaint_id: complaint._id,
        action: "ADMIN_REMARK",
        description: remark,
        performed_by: currentUser._id,
        role: currentUser.role,
    });

    return { message: "Remark added successfully" };
};