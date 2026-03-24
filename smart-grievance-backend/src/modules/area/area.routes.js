import express from "express";
import * as controller from "./area.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    controller.createArea
);

router.get(
    "/",
    protect,
    controller.getAllAreas
);

router.get(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.getAreaById
);

router.put(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.updateArea
);

router.patch(
    "/:id/deactivate",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deactivateArea
);

export default router;