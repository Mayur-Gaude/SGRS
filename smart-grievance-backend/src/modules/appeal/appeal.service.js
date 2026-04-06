import BanAppeal from "../../models/banAppeal.model.js";
import Ban from "../../models/ban.model.js";
import User from "../../models/user.model.js";


// 🟢 User submits appeal
export const createAppeal = async (banId, reason, currentUser) => {

    const ban = await Ban.findById(banId);
    console.log("Ban : ", ban);

    if (!ban) {
        throw new Error("Ban not found");
    }

    // Only banned user can appeal
    if (ban.user_id.toString() !== currentUser._id.toString()) {
        throw new Error("Unauthorized");
    }

    const appeal = await BanAppeal.create({
        ban_id: banId,
        user_id: currentUser._id,
        appeal_reason: reason,
    });

    return appeal;
};


// 🔵 Super Admin reviews appeal
export const reviewAppeal = async (
    appealId,
    decision,
    currentUser
) => {

    if (currentUser.role !== "SUPER_ADMIN") {
        throw new Error("Only super admin can review appeals");
    }

    const appeal = await BanAppeal.findById(appealId);

    if (!appeal) {
        throw new Error("Appeal not found");
    }

    if (appeal.status !== "PENDING") {
        throw new Error("Appeal already reviewed");
    }

    appeal.status = decision;
    appeal.reviewed_by = currentUser._id;
    appeal.reviewed_at = new Date();

    await appeal.save();

    // 🔥 If approved → remove ban
    if (decision === "APPROVED") {
        const ban = await Ban.findById(appeal.ban_id);

        if (ban) {
            await Ban.findByIdAndDelete(ban._id);

            await User.findByIdAndUpdate(appeal.user_id, {
                account_status: "ACTIVE",
                account_reason: null,
            });
        }
    }

    return appeal;
};