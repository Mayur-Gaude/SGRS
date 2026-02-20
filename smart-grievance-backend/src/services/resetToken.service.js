import jwt from "jsonwebtoken";

export const generateResetToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });
};