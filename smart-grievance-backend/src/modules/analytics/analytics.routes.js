import express from "express";
import * as controller from "./analytics.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

// Department dashboard
router.get(
    "/department/:departmentId",
    protect,
    authorize("SUPER_ADMIN", "DEPT_ADMIN"),
    controller.getDepartmentDashboard
);

// System overview
router.get(
    "/overview",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getSystemOverview
);

// Area analytics
router.get(
    "/areas",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getAreaInsights
);

// Category analytics
router.get(
    "/categories",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getCategoryInsights
);

// Generate report
router.post(
    "/generate",
    protect,
    authorize("SUPER_ADMIN"),
    controller.generateReport
);

// Get reports
router.get(
    "/reports/:departmentId",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getDepartmentReports
);

// Admin performance
router.get(
    "/admin/:adminId",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getAdminPerformanceStats
);

export default router;