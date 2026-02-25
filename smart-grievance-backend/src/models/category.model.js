import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM",
        },

        sla_response_hours: {
            type: Number,
            required: true,
        },

        sla_resolution_hours: {
            type: Number,
            required: true,
        },

        is_active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Optional: Prevent duplicate category in same department
categorySchema.index(
    { name: 1, department_id: 1 },
    { unique: true }
);

export default mongoose.model("Category", categorySchema);