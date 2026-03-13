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
                "CLOSED"
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
    },
    { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);