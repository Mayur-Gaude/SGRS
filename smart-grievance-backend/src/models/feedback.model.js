import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        complaint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
            unique: true, // 1 complaint = 1 feedback
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export default mongoose.model("Feedback", feedbackSchema);