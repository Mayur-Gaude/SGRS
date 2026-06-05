import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
    {
        complaint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
        },

        action: {
            type: String,
            required: true,
        },

        description: String,

        performed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        role: String,
    },
    { timestamps: true }
);

export default mongoose.model("ComplaintTimeline", timelineSchema);