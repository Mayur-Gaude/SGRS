//category.routes.js
import express from "express";
import * as controller from "./category.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    controller.createCategory
);

router.get(
    "/",
    protect,
    controller.getAllCategories
);

router.get(
    "/department/:department_id",
    protect,
    controller.getCategoriesByDepartment
);

router.get(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getCategoryById
);

router.put(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.updateCategory
);

router.patch(
    "/:id/deactivate",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deactivateCategory
);

export default router;