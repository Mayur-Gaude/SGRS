import express from "express";
import * as controller from "./ban.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { allowBannedForAppeal } from "../../middleware/allowBanned.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    controller.createBan
);

router.get(
    "/my-ban",
    allowBannedForAppeal,
    protect,
    authorize("USER"),
    controller.getMyBan
);

export default router;