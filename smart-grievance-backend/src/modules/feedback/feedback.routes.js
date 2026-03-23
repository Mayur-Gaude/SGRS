import express from "express";
import * as controller from "./feedback.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/:id",
    protect,
    authorize("USER"),
    controller.submitFeedback
);

export default router;