import mongoose from "mongoose";

const banSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    violation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Violation",
        required: true,
        unique: true,
    },

    ban_type: {
        type: String,
        enum: ["TEMPORARY", "PERMANENT"],
        required: true,
    },

    ban_reason: {
        type: String,
    },

    ban_start: {
        type: Date,
        default: Date.now,
    },

    ban_end: {
        type: Date,
        default: null,
    },

    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SuperAdmin",
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Ban", banSchema);