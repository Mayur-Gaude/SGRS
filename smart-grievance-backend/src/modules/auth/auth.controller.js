import * as authService from "./auth.service.js";
import { successResponse } from "../../utils/response.js";

export const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        return successResponse(res, result, "Registration successful. Verify OTP.");
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const result = await authService.verifyUserOtp(req.body);
        return successResponse(res, result, "Verification successful.");
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        return successResponse(res, result, "Login successful.");
    } catch (error) {
        next(error);
    }
};

export const getMyProfile = async (req, res, next) => {
    try {
        const result = await authService.getMyProfile(req.user);
        return successResponse(res, result, "Profile fetched successfully.");
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const result = await authService.updateMyProfile(req.user, req.body);
        return successResponse(res, result, "Profile updated successfully.");
    } catch (error) {
        next(error);
    }
};

export const requestPasswordReset = async (req, res, next) => {
    try {
        const result = await authService.requestPasswordReset(req.body);
        return successResponse(res, result, "Password reset OTP sent.");
    } catch (error) {
        next(error);
    }
};

// export const resetPassword = async (req, res, next) => {
//     try {
//         const result = await authService.resetPassword(req.body);
//         return successResponse(res, result, "Password reset successful.");
//     } catch (error) {
//         next(error);
//     }
// };

export const resendOtp = async (req, res, next) => {
    try {
        const result = await authService.resendOtp(req.body);
        return successResponse(res, result, "OTP resent successfully.");
    } catch (error) {
        next(error);
    }
};

export const verify2FA = async (req, res, next) => {
    try {
        const result = await authService.verify2FA(req.body);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const verifyResetOtp = async (req, res, next) => {
    try {
        const result = await authService.verifyResetOtp(req.body);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const setNewPassword = async (req, res, next) => {
    try {
        const result = await authService.setNewPassword(req.body);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};