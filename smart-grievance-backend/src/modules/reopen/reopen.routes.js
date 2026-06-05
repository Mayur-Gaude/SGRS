import express from "express";
import * as controller from "./reopen.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

// Citizen
router.post(
    "/:id",
    protect,
    authorize("USER"),
    controller.requestReopen
);

// Admin
router.patch(
    "/review/:id",
    protect,
    authorize("DEPT_ADMIN"),
    controller.reviewReopen
);

export default router;