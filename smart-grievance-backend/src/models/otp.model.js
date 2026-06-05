import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        otp_code: {
            type: String,
            required: true,
        },

        otp_type: {
            type: String,
            enum: [
                "EMAIL_VERIFICATION",
                "PHONE_VERIFICATION",
                "LOGIN_2FA",
                "PASSWORD_RESET",
            ],
            required: true,
        },

        target: {
            type: String, // email or phone
            required: true,
        },

        expires_at: {
            type: Date,
            required: true,
        },

        is_verified: {
            type: Boolean,
            default: false,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        is_used: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);