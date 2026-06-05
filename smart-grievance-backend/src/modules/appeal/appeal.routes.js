import express from "express";
import * as controller from "./appeal.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { allowBannedForAppeal } from "../../middleware/allowBanned.middleware.js";

const router = express.Router();

// // User submits appeal
// router.post(
//     "/:id",
//     protect,
//     authorize("USER"),
//     controller.createAppeal
// );

router.post(
    "/:id",
    allowBannedForAppeal,
    protect,
    authorize("USER"),
    controller.createAppeal
);

// Super admin reviews appeal
router.patch(
    "/review/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.reviewAppeal
);

export default router;