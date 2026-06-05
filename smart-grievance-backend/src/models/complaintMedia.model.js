import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        complaint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
        },

        media_type: {
            type: String,
            enum: ["PHOTO", "VIDEO", "DOCUMENT"],
            default: "PHOTO",
        },

        media_url: {
            type: String,
            required: true,
        },

        uploaded_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("ComplaintMedia", mediaSchema);