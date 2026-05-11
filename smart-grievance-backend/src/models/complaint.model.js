import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        complaint_number: {
            type: String,
            unique: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        area_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Area",
            required: true,
        },

        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        latitude: Number,
        longitude: Number,
        pincode: String,

        status: {
            type: String,
            enum: [
                "SUBMITTED",
                "UNDER_REVIEW",
                "IN_PROGRESS",
                "RESOLVED",
                "REJECTED",
                "CLOSED",
                "REOPENED",
                "REOPEN_REQUESTED",
            ],
            default: "SUBMITTED",
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        },

        assigned_admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        sla_response_deadline: Date,
        sla_resolution_deadline: Date,

        is_escalated: {
            type: Boolean,
            default: false,
        },
        feedback_submitted: {
            type: Boolean,
            default: false,
        },
        rejection_reason: {
            type: String,
            default: null,
        },

        risk_score: {
            type: Number,
            default: 0,
        },

        risk_level: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "LOW",
        },

        feedback_submitted: {
            type: Boolean,
            default: false,
        },

        reopen_count: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);