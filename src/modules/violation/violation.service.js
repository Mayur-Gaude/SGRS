import Violation from "../../models/violation.model.js";
import Complaint from "../../models/complaint.model.js";
import userModel from "../../models/user.model.js";
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


    const shouldWarn = totalScore >= 20;

    return {
        violation,
        totalScore,
        suggested_action,
        shouldWarn,
    };
};

export const getViolations = async (currentUser) => {

    const query = {};

    // Dept Admin sees own reported violations
    if (currentUser.role === "DEPT_ADMIN") {
        query.reported_by = currentUser._id;
    }

    return Violation.find(query)
        .populate("user_id", "full_name email")
        .populate("complaint_id", "title complaint_number")
        .populate("reported_by", "full_name email")
        .sort({ createdAt: -1 });
};

export const getViolationManagement = async () => {

    const violations = await Violation.find()
        .populate("user_id", "full_name email account_status")
        .populate("complaint_id", "title")
        .sort({ createdAt: -1 });

    const grouped = {};

    for (const v of violations) {

        if (!v.user_id) {
            console.warn("Violation has no user_id:", v._id);
            continue; // skip this violation
        }
        const userId = v.user_id._id.toString();

        if (!grouped[userId]) {

            grouped[userId] = {
                user: v.user_id,
                violations: [],
                total_score: 0,
                suggested_action: "NONE",
            };
        }

        grouped[userId].violations.push(v);

        // score calculation
        switch (v.severity) {

            case "LOW":
                grouped[userId].total_score += 10;
                break;

            case "MEDIUM":
                grouped[userId].total_score += 20;
                break;

            case "HIGH":
                grouped[userId].total_score += 40;
                break;

            case "CRITICAL":
                grouped[userId].total_score += 70;
                break;
        }
    }

    // Suggested action
    Object.values(grouped).forEach((u) => {

        if (u.total_score >= 100) {
            u.suggested_action = "PERMANENT_BAN";
        }

        else if (u.total_score >= 50) {
            u.suggested_action = "TEMP_BAN";
        }

        else if (u.total_score >= 20) {
            u.suggested_action = "WARNING";
        }
    });

    return Object.values(grouped);
};

export const getViolationById = async (id) => {

    const violation = await Violation.findById(id)
        .populate("user_id", "full_name email");

    if (!violation) {
        throw new Error("Violation not found");
    }

    return violation;
};