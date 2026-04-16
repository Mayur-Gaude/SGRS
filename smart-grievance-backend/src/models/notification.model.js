import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    complaint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },
    type: {
      type: String,
      enum: ["COMPLAINT_SUBMITTED", "STATUS_UPDATED", "COMPLAINT_RESOLVED", "COMPLAINT_REJECTED", "SYSTEM"],
      default: "SYSTEM",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    is_read: {
      type: Boolean,
      default: false,
      index: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
