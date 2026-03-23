import express from "express";
import * as controller from "./complaint.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import * as mediaController from "./media.controller.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

// Submit complaint (Only USER role)
router.post(
    "/",
    protect,
    authorize("USER"),
    controller.submitComplaint
);

// Get complaint list (role-based inside service)
router.get(
    "/",
    protect,
    controller.getComplaints
);

// Get assigned complaints for DEPT_ADMIN
router.get(
    "/assigned",
    protect,
    authorize("DEPT_ADMIN"),
    controller.getAssignedComplaints
);

// Get complaint details
router.get(
    "/:id",
    protect,
    controller.getComplaintById
);

// Update complaint status (Only DEPT_ADMIN)
router.patch(
    "/:id/status",
    protect,
    authorize("DEPT_ADMIN"),
    controller.updateComplaintStatus
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

router.post(
    "/:id/remarks",
    protect,
    authorize("DEPT_ADMIN"),
    controller.addRemark
);


router.patch(
    "/:id/resolve",
    protect,
    authorize("DEPT_ADMIN"),
    controller.resolveComplaint
);

export default router;  