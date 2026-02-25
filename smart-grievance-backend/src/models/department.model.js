import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },

        description: {
            type: String,
        },

        contact_email: {
            type: String,
        },

        contact_phone: {
            type: String,
        },

        is_active: {
            type: Boolean,
            default: true,
        },

        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);