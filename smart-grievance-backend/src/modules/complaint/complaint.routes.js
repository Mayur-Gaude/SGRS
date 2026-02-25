import express from "express";
import * as controller from "./complaint.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import * as mediaController from "./media.controller.js";

const router = express.Router();

// Submit complaint (Only USER role)
router.post(
    "/",
    protect,
    controller.submitComplaint
);

// Get complaint list (role-based inside service)
router.get(
    "/",
    protect,
    controller.getComplaints
);

// Get complaint details
router.get(
    "/:id",
    protect,
    controller.getComplaintById
);

// Upload media
router.post(
    "/:id/media",
    protect,
    upload.single("file"),
    mediaController.uploadMedia
);

// Get media
router.get(
    "/:id/media",
    protect,
    mediaController.getMedia
);

export default router;