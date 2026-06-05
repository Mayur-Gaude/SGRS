import mongoose from "mongoose";

const reopenRequestSchema = new mongoose.Schema(
    {
        complaint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reason: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
        },

        reviewed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DepartmentAdmin",
        },

        reviewed_at: {
            type: Date,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export default mongoose.model("ReopenRequest", reopenRequestSchema);