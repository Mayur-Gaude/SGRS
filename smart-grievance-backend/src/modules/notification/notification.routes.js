import express from "express";
import * as controller from "./notification.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, authorize("USER"), controller.getMyNotifications);
router.patch("/:id/read", protect, authorize("USER"), controller.markNotificationRead);
router.patch("/read-all", protect, authorize("USER"), controller.markAllNotificationsRead);

export default router;
