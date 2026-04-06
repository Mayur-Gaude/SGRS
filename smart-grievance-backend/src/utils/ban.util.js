import Ban from "../models/ban.model.js";

export const checkActiveBan = async (userId) => {

    const ban = await Ban.findOne({ user_id: userId });

    if (!ban) return null;

    // Permanent ban
    if (ban.ban_type === "PERMANENT") {
        return ban;
    }

    // Temporary ban check
    if (ban.ban_end && new Date() < ban.ban_end) {
        return ban;
    }

    // If temp ban expired → allow access
    return null;
};