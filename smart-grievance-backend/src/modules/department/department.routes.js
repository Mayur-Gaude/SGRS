// department.routes.js
import express from "express";
import * as controller from "./department.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    controller.createDepartment
);

router.get(
    "/",
    protect,
    authorize("SUPER_ADMIN", "USER"),
    controller.getAllDepartments
);

router.get(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getDepartmentById
);

router.put(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.updateDepartment
);

router.patch(
    "/:id/deactivate",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deactivateDepartment
);

router.patch(
    "/:id/activate",
    protect,
    authorize("SUPER_ADMIN"),
    controller.activateDepartment
);

export default router;