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

// export const getMyBan = async (currentUser) => {

//     const ban = await Ban.findOne({
//         user_id: currentUser._id
//     }).sort({ createdAt: -1 });

//     if (!ban) {
//         throw new Error("No active ban found");
//     }

//     return ban;
// };

// export const getMyBan = async (req, res) => {
//     try {
//         const ban = await Ban.findOne({ user_id: req.user._id }).sort({ createdAt: -1 });

//         if (!ban) {
//             return res.status(404).json({ success: false, message: "No active ban found" });
//         }

//         res.json({ success: true, data: ban });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };


export const getMyBan = async (
    currentUser
) => {

    const ban = await Ban.findOne({
        user_id: currentUser._id
    })
        .populate(
            "violation_id",
            "violation_type severity"
        )
        .sort({ created_at: -1 });

    // if (!ban) {
    //     throw new Error(
    //         "No active ban found"
    //     );
    // }

    if (!ban) {
        return { status: "NOT_FOUND", ban: null };
    }

    // 🔥 TEMP BAN EXPIRED
    if (
        ban.ban_type === "TEMPORARY" &&
        ban.ban_end &&
        new Date() >
        new Date(ban.ban_end)
    ) {

        // restore account
        await User.findByIdAndUpdate(
            currentUser._id,
            {
                account_status: "ACTIVE",
                account_reason: null,
            }
        );

        // remove ban
        await Ban.findByIdAndDelete(
            ban._id
        );

        // throw new Error(
        //     "Ban expired"
        // );
        return { status: "EXPIRED", ban: null };
    }

    // return ban;
    return { status: "ACTIVE", ban };
};
