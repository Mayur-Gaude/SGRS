//auth.routes.js
import express from "express";
import * as controller from "./auth.controller.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/verify-otp", controller.verifyOtp);
router.post("/resend-otp", controller.resendOtp);
router.post("/login", controller.login);
router.post("/forgot-password", controller.requestPasswordReset);
// router.post("/reset-password", controller.resetPassword);
router.post("/forgot-password", controller.requestPasswordReset);
router.post("/verify-reset-otp", controller.verifyResetOtp);
router.post("/set-new-password", controller.setNewPassword);
router.post("/verify-2fa", controller.verify2FA);

export default router;