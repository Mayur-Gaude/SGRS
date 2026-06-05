import mongoose from "mongoose";

const violationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
        default: null,
    },

    violation_type: {
        type: String,
        enum: [
            "SPAM_SUBMISSION",
            "FAKE_COMPLAINT",
            "DUPLICATE_ABUSE",
            "INAPPROPRIATE_CONTENT",
            "LOCATION_MANIPULATION",
            "HARASSMENT",
            "OTHER",
        ],
        required: true,
    },

    severity: {
        type: String,
        enum: ["MINOR", "MODERATE", "SEVERE", "CRITICAL"],
        required: true,
    },

    reason: {
        type: String,
        required: true,
    },

    reported_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DepartmentAdmin",
    },

    detected_by_system: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        enum: ["REPORTED", "REVIEWED", "DISMISSED"],
        default: "REPORTED",
    },

    reviewed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SuperAdmin",
    },

    reviewed_at: Date,

    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Violation", violationSchema);