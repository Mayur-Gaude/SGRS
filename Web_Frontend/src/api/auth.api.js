import API from "./axios";

export const registerUser = (data) => API.post("/auth/register", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
export const resendOtp = (data) => API.post("/auth/resend-otp", data);

export const loginUser = (data) => API.post("/auth/login", data);
export const verify2FA = (data) => API.post("/auth/verify-2fa", data);

export const forgotPassword = (data) =>
    API.post("/auth/forgot-password", data);

export const verifyResetOtp = (data) =>
    API.post("/auth/verify-reset-otp", data);

export const setNewPassword = (data) =>
    API.post("/auth/set-new-password", data);