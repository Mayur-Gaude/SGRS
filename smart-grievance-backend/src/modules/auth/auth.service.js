import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import Otp from "../../models/otp.model.js";
import { generateOTP } from "../../utils/otp.generator.js";
import { sendEmailOTP } from "../../services/email.service.js";
import { sendSMSOTP } from "../../services/sms.service.js";
import { generateToken } from "../../services/jwt.service.js";
import { generateResetToken } from "../../services/resetToken.service.js";

export const getMyProfile = async (currentUser) => {
    const user = await User.findById(currentUser._id)
        .select("_id full_name email phone avatar_url role department_id area_ids email_verified phone_verified is_active createdAt")
        .populate("department_id", "name code")
        .populate("area_ids", "name");

    if (!user) throw new Error("User not found");

    return {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role,
        department: user.department_id || null,
        areas: user.area_ids || [],
        email_verified: user.email_verified,
        phone_verified: user.phone_verified,
        is_active: user.is_active,
        createdAt: user.createdAt,
    };
};

export const updateMyProfile = async (currentUser, data) => {
    const user = await User.findById(currentUser._id);
    if (!user) throw new Error("User not found");

    const payload = {};

    if (typeof data.full_name === "string" && data.full_name.trim()) {
        payload.full_name = data.full_name.trim();
    }

    if (typeof data.phone === "string" && data.phone.trim()) {
        const nextPhone = data.phone.trim();
        if (nextPhone !== user.phone) {
            const existingPhone = await User.findOne({
                phone: nextPhone,
                _id: { $ne: user._id },
            });
            if (existingPhone) throw new Error("Phone already in use");
        }
        payload.phone = nextPhone;
    }

    if (typeof data.avatar_url === "string") {
        payload.avatar_url = data.avatar_url.trim() || null;
    }

    const updated = await User.findByIdAndUpdate(user._id, payload, {
        new: true,
    })
        .select("_id full_name email phone avatar_url role department_id area_ids email_verified phone_verified is_active createdAt")
        .populate("department_id", "name code")
        .populate("area_ids", "name");

    return {
        id: updated._id,
        full_name: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        avatar_url: updated.avatar_url,
        role: updated.role,
        department: updated.department_id || null,
        areas: updated.area_ids || [],
        email_verified: updated.email_verified,
        phone_verified: updated.phone_verified,
        is_active: updated.is_active,
        createdAt: updated.createdAt,
    };
};

//Registration flow
export const registerUser = async ({ full_name, email, phone, password }) => {
    const existing = await User.findOne({
        $or: [{ email }, { phone }],
    });

    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        full_name,
        email,
        phone,
        password_hash: hashed,
        role: "USER",
    });

    const emailOtp = generateOTP();
    const phoneOtp = generateOTP();

    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create([
        {
            user_id: user._id,
            otp_code: emailOtp,
            otp_type: "EMAIL_VERIFICATION",
            target: email,
            expires_at: expiry,
        },
        {
            user_id: user._id,
            otp_code: phoneOtp,
            otp_type: "PHONE_VERIFICATION",
            target: phone,
            expires_at: expiry,
        },
    ]);

    await sendEmailOTP(email, emailOtp);
    await sendSMSOTP(phone, phoneOtp);

    return {
        message: "OTP sent to email and phone",
        user_id: user._id,
    };
};

//OTP verification flow
export const verifyUserOtp = async ({ user_id, otp_code, otp_type }) => {
    const otp = await Otp.findOne({
        user_id,
        otp_code,
        otp_type,
        is_verified: false,
    });

    if (!otp) throw new Error("Invalid OTP");

    if (otp.expires_at < new Date())
        throw new Error("OTP expired");

    otp.is_verified = true;
    await otp.save();

    if (otp_type === "EMAIL_VERIFICATION") {
        await User.findByIdAndUpdate(user_id, {
            email_verified: true,
        });
    }

    if (otp_type === "PHONE_VERIFICATION") {
        await User.findByIdAndUpdate(user_id, {
            phone_verified: true,
        });
    }

    return { message: "OTP verified successfully" };
};

//login flow
export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (user.lock_until && user.lock_until > Date.now()) {
        throw new Error("Account locked. Try later.");
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        user.login_attempts += 1;

        if (
            user.login_attempts >= process.env.MAX_LOGIN_ATTEMPTS
        ) {
            user.lock_until = new Date(
                Date.now() +
                process.env.LOCK_TIME_MINUTES * 60 * 1000
            );
            user.login_attempts = 0;
        }

        await user.save();
        throw new Error("Invalid credentials");
    }

    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();

    if (!user.email_verified || !user.phone_verified)
        throw new Error("Verify email and phone first");

    // OTP required only for super admin (temporary until DEPT_ADMIN 2FA UI is added)
    if (user.role === "SUPER_ADMIN") {
        const otp = generateOTP();
        const expiry = new Date(
            Date.now() + process.env.OTP_EXPIRE_MINUTES * 60 * 1000
        );

        await Otp.create({
            user_id: user._id,
            otp_code: otp,
            otp_type: "LOGIN_2FA",
            target: user.email,
            expires_at: expiry,
        });

        await sendEmailOTP(user.email, otp);

        return {
            requires_2fa: true,
            user_id: user._id,
            role: user.role,
        };
    }

    const token = generateToken({
        id: user._id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
        },
    };
};

//2FA verification flow
export const verify2FA = async ({ user_id, otp_code }) => {
    const otp = await Otp.findOne({
        user_id,
        otp_code,
        otp_type: "LOGIN_2FA",
        is_verified: false,
    });

    if (!otp) throw new Error("Invalid OTP");
    if (otp.expires_at < new Date())
        throw new Error("OTP expired");

    otp.is_verified = true;
    await otp.save();

    const user = await User.findById(user_id);

    const token = generateToken({
        id: user._id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user._id,
            role: user.role,
        },
    };
};

//Resend OTP flow
export const resendOtp = async ({ user_id, otp_type }) => {
    const existing = await Otp.findOne({
        user_id,
        otp_type,
        is_verified: false,
    }).sort({ createdAt: -1 });

    if (!existing) throw new Error("No OTP request found");

    const cooldown =
        (Date.now() - new Date(existing.createdAt).getTime()) / 1000;

    if (cooldown < process.env.OTP_RESEND_COOLDOWN_SECONDS) {
        throw new Error("Please wait before requesting again");
    }

    const newOtp = generateOTP();
    const expiry = new Date(
        Date.now() +
        process.env.OTP_EXPIRE_MINUTES * 60 * 1000
    );

    existing.otp_code = newOtp;
    existing.expires_at = expiry;
    existing.attempts = 0;
    await existing.save();

    if (otp_type === "EMAIL_VERIFICATION") {
        await sendEmailOTP(existing.target, newOtp);
    }

    if (otp_type === "PHONE_VERIFICATION") {
        await sendSMSOTP(existing.target, newOtp);
    }

    if (otp_type === "LOGIN_2FA") {
        await sendEmailOTP(existing.target, newOtp);
    }

    return { message: "OTP resent successfully" };
};


//Password request reset flow
export const requestPasswordReset = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const otp = generateOTP();
    const expiry = new Date(
        Date.now() +
        process.env.OTP_EXPIRE_MINUTES * 60 * 1000
    );

    await Otp.create({
        user_id: user._id,
        otp_code: otp,
        otp_type: "PASSWORD_RESET",
        target: email,
        expires_at: expiry,
    });

    await sendEmailOTP(email, otp);

    return {
        message: "Password reset OTP sent",
        user_id: user._id,
    };
};

//Password reset OTP verification flow
export const verifyResetOtp = async ({ user_id, otp_code }) => {
    const otp = await Otp.findOne({
        user_id,
        otp_code,
        otp_type: "PASSWORD_RESET",
        is_verified: false,
    });

    if (!otp) throw new Error("Invalid OTP");
    if (otp.expires_at < new Date())
        throw new Error("OTP expired");

    otp.is_verified = true;
    await otp.save();

    const reset_token = generateResetToken({
        user_id,
        purpose: "PASSWORD_RESET",
    });

    return {
        message: "OTP verified successfully",
        reset_token,
    };
};

//password reset flow
// export const resetPassword = async ({
//     user_id,
//     otp_code,
//     new_password,
// }) => {
//     const otp = await Otp.findOne({
//         user_id,
//         otp_code,
//         otp_type: "PASSWORD_RESET",
//         is_verified: false,
//     });

//     if (!otp) throw new Error("Invalid OTP");

//     if (otp.expires_at < new Date())
//         throw new Error("OTP expired");

//     const hashed = await bcrypt.hash(new_password, 10);

//     await User.findByIdAndUpdate(user_id, {
//         password_hash: hashed,
//     });

//     otp.is_verified = true;
//     await otp.save();

//     return { message: "Password reset successful" };
// };

export const setNewPassword = async ({
    reset_token,
    new_password,
}) => {
    let decoded;

    // try {
    //     decoded = jwt.verify(reset_token, process.env.JWT_SECRET);
    // } catch (err) {
    //     console.error("Reset token verification failed:", err);
    //     throw new Error("Invalid or expired reset token");
    // }

    try {
        decoded = jwt.verify(reset_token, process.env.JWT_SECRET);
        console.log("Decoded reset token:", decoded);
    } catch (err) {
        console.error("Reset token verification failed:", err);
        throw new Error("Invalid or expired reset token");
    }

    if (decoded.purpose !== "PASSWORD_RESET")
        throw new Error("Invalid reset token");

    const hashed = await bcrypt.hash(new_password, 10);

    await User.findByIdAndUpdate(decoded.user_id, {
        password_hash: hashed,
    });

    return { message: "Password updated successfully" };
};