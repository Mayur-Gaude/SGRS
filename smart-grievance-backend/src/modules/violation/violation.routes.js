import express from "express";
import * as controller from "./violation.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

// Create violation
router.post(
    "/",
    protect,
    authorize("DEPT_ADMIN", "SUPER_ADMIN"),
    controller.createViolation
);

export default router;