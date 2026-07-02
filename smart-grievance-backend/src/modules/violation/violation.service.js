import Violation from "../../models/violation.model.js";
import Complaint from "../../models/complaint.model.js";
import userModel from "../../models/user.model.js";
import {
    calculateUserScore,
    getSuggestedAction,
    getRecentViolations,
    getPointsFromSeverity,
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
    // const userViolations = await Violation.find({ user_id });

    // const totalScore = calculateUserScore(userViolations);


    const userViolations = await Violation.find({ user_id });

    const activeViolations =
        getRecentViolations(userViolations, 12);

    const totalScore =
        calculateUserScore(activeViolations);

    // console.log("Userviolations", userViolations);
    // console.log("Activeviolations", activeViolations);

    // const suggested_action = getSuggestedAction(
    //     totalScore,
    //     severity
    // );

    const suggested_action = getSuggestedAction({
        score: totalScore,
        violations: activeViolations,
    });

    // if (
    //     suggested_action.action === "TEMP_BAN"
    // ) {
    //     await userModel.findByIdAndUpdate(
    //         user_id,
    //         {
    //             account_status: "SUSPENDED",
    //         }
    //     );
    // }


    // const shouldWarn = totalScore >= 20;

    const shouldWarn =
        ["WARNING", "TEMP_BAN", "REVIEW_FOR_PERMANENT_BAN"]
            .includes(suggested_action.action);

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
        // switch (v.severity) {

        //     case "MINOR":
        //         grouped[userId].total_score += 10;
        //         break;

        //     case "MODERATE":
        //         grouped[userId].total_score += 20;
        //         break;

        //     case "SEVERE":
        //         grouped[userId].total_score += 40;
        //         break;

        //     case "CRITICAL":
        //         grouped[userId].total_score += 70;
        //         break;
        // }

        grouped[userId].total_score +=
            getPointsFromSeverity(v.severity);
    }

    // Suggested action
    // Object.values(grouped).forEach((u) => {

    //     if (u.total_score >= 100) {
    //         u.suggested_action = "PERMANENT_BAN";
    //     }

    //     else if (u.total_score >= 50) {
    //         u.suggested_action = "TEMP_BAN";
    //     }

    //     else if (u.total_score >= 20) {
    //         u.suggested_action = "WARNING";
    //     }
    // });

    Object.values(grouped).forEach((u) => {

        const action = getSuggestedAction({
            score: u.total_score,
            violations: u.violations,
        });

        u.suggested_action = action;
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