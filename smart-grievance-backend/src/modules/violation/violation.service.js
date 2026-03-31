import Violation from "../../models/violation.model.js";
import Complaint from "../../models/complaint.model.js";
import {
    calculateUserScore,
    getSuggestedAction,
} from "../../services/violationScore.service.js";

export const createViolation = async (data, currentUser) => {
    const {
        user_id,
        complaint_id,
        violation_type,
        severity,
        reason,
    } = data;

    if (!["DEPT_ADMIN", "SUPER_ADMIN"].includes(currentUser.role)) {
        throw new Error("Unauthorized");
    }

    // Optional: Validate complaint
    if (complaint_id) {
        const complaint = await Complaint.findById(complaint_id);
        if (!complaint) throw new Error("Complaint not found");
    }

    // Create violation
    const violation = await Violation.create({
        user_id,
        complaint_id,
        violation_type,
        severity,
        reason,
        reported_by: currentUser._id,
    });

    // Fetch all violations of user
    const userViolations = await Violation.find({ user_id });

    const totalScore = calculateUserScore(userViolations);

    const suggested_action = getSuggestedAction(
        totalScore,
        severity
    );

    return {
        violation,
        totalScore,
        suggested_action,
    };
};