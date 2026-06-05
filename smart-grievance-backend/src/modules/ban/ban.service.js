import Ban from "../../models/ban.model.js";
import Violation from "../../models/violation.model.js";
import User from "../../models/user.model.js";

export const createBan = async (data, currentUser) => {
    const {
        violation_id,
        ban_type,
        ban_reason,
        duration_days,
    } = data;

    if (currentUser.role !== "SUPER_ADMIN") {
        throw new Error("Only super admin can create ban");
    }

    const violation = await Violation.findById(violation_id);

    if (!violation) {
        throw new Error("Violation not found");
    }

    // Ensure violation is not already banned
    const existingBan = await Ban.findOne({ violation_id });

    if (existingBan) {
        throw new Error("Ban already exists for this violation");
    }

    let ban_end = null;

    if (ban_type === "TEMPORARY") {
        if (!duration_days) {
            throw new Error("Duration required for temporary ban");
        }

        ban_end = new Date(
            Date.now() + duration_days * 24 * 60 * 60 * 1000
        );
    }

    const ban = await Ban.create({
        user_id: violation.user_id,
        violation_id,
        ban_type,
        ban_reason,
        ban_start: new Date(),
        ban_end,
        approved_by: currentUser._id,
    });

    // 🔥 Update user status
    await User.findByIdAndUpdate(violation.user_id, {
        account_status: "BANNED",
        account_reason: ban_reason,
    });

    return ban;
};