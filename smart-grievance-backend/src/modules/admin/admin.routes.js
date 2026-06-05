import express from "express";
import * as controller from "./admin.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/department-admin",
    protect,
    authorize("SUPER_ADMIN"),
    controller.createDepartmentAdmin
);

router.get(
    "/department-admin",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getAllDepartmentAdmins
);

router.put(
    "/department-admin/:id/areas",
    protect,
    authorize("SUPER_ADMIN"),
    controller.updateDepartmentAdminAreas
);

router.patch(
    "/department-admin/:id/deactivate",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deactivateDepartmentAdmin
);

export default router;