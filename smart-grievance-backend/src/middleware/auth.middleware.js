// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
// import { checkActiveBan } from "../utils/ban.util.js";

// export const protect = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];

//         if (!token) throw new Error("Unauthorized");

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.id);
//         if (!user) throw new Error("User not found");

//         // Check ban
//         const activeBan = await checkActiveBan(user._id);

//         if (activeBan) {
//             return res.status(403).json({
//                 success: false,
//                 message: `Account banned: ${activeBan.ban_reason}`,
//             });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         next(error);
//     }
// };

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { checkActiveBan } from "../utils/ban.util.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const activeBan = await checkActiveBan(user._id);

        // 🔥 Check user status
        if (user.account_status === "BANNED" && !req.allowBanned) {
            return res.status(403).json({
                success: false,
                message: `Account banned: ${user.account_reason || "Contact support"}`,
            });
        }

        if (activeBan && !req.allowBanned) {
            return res.status(403).json({
                success: false,
                message: `Account banned: ${activeBan.ban_reason}`,
            });
        }

        req.user = user;
        req.activeBan = activeBan;

        next();
    } catch (error) {
        next(error);
    }
};