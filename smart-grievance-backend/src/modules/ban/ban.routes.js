import express from "express";
import * as controller from "./ban.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    controller.createBan
);

export default router;