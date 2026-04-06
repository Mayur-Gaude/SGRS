import Feedback from "../../models/feedback.model.js";
import Complaint from "../../models/complaint.model.js";
import { createTimelineEntry } from "../../utils/timeline.util.js";

export const submitFeedback = async (
    complaintId,
    rating,
    comment,
    currentUser
) => {

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
        throw new Error("Complaint not found");
    }

    // Only complaint owner can give feedback
    if (complaint.user_id.toString() !== currentUser._id.toString()) {
        throw new Error("Unauthorized");
    }

    // Only after resolution
    if (complaint.status !== "RESOLVED") {
        throw new Error("Feedback allowed only after resolution");
    }

    // Prevent duplicate feedback
    const existing = await Feedback.findOne({ complaint_id: complaintId });

    if (existing) {
        throw new Error("Feedback already submitted");
    }

    const feedback = await Feedback.create({
        complaint_id: complaintId,
        user_id: currentUser._id,
        rating,
        comment,
    });

    // Timeline entry
    await createTimelineEntry({
        complaint_id: complaint._id,
        action: "FEEDBACK_SUBMITTED",
        description: `Rating: ${rating}, Comment: ${comment || "N/A"}`,
        performed_by: currentUser._id,
        role: currentUser.role,
    });

    return feedback;
};