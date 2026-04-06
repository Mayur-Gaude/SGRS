import mongoose from "mongoose";

const banAppealSchema = new mongoose.Schema({
    ban_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ban",
        required: true,
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    appeal_reason: {
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
        ref: "SuperAdmin",
    },

    reviewed_at: {
        type: Date,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("BanAppeal", banAppealSchema);