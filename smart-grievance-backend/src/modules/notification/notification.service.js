import Notification from "../../models/notification.model.js";

export const getMyNotifications = async (currentUser) => {
  const items = await Notification.find({ user_id: currentUser._id })
    .populate("complaint_id", "complaint_number title status")
    .sort({ createdAt: -1 })
    .limit(100);

  const unreadCount = await Notification.countDocuments({
    user_id: currentUser._id,
    is_read: false,
  });

  return { items, unreadCount };
};

export const markNotificationRead = async (notificationId, currentUser) => {
  const item = await Notification.findOne({ _id: notificationId, user_id: currentUser._id });
  if (!item) throw new Error("Notification not found");

  item.is_read = true;
  await item.save();

  return item;
};

export const markAllNotificationsRead = async (currentUser) => {
  await Notification.updateMany(
    { user_id: currentUser._id, is_read: false },
    { $set: { is_read: true } }
  );

  return { success: true };
};
