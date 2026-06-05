import Notification from "../models/notification.model.js";

export const createUserNotification = async ({
  user_id,
  complaint_id = null,
  type = "SYSTEM",
  title,
  message,
  meta = {},
}) => {
  if (!user_id || !title || !message) return null;

  return Notification.create({
    user_id,
    complaint_id,
    type,
    title,
    message,
    meta,
  });
};
