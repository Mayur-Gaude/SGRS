import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        avatar_url: {
            type: String,
            default: null,
        },

        password_hash: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["USER", "DEPT_ADMIN", "SUPER_ADMIN"],
            default: "USER",
            index: true,
        },

        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },

        email_verified: {
            type: Boolean,
            default: false,
        },

        phone_verified: {
            type: Boolean,
            default: false,
        },

        two_fa_enabled: {
            type: Boolean,
            default: false,
        },

        two_fa_method: {
            type: String,
            enum: ["EMAIL", "SMS", "TOTP"],
            default: null,
        },

        is_active: {
            type: Boolean,
            default: true,
        },
        login_attempts: {
            type: Number,
            default: 0,
        },

        lock_until: {
            type: Date,
            default: null,
        },
        area_ids: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Area",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);