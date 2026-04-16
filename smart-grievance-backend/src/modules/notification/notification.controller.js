import * as service from "./notification.service.js";
import { successResponse } from "../../utils/response.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const result = await service.getMyNotifications(req.user);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const result = await service.markNotificationRead(req.params.id, req.user);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const result = await service.markAllNotificationsRead(req.user);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
