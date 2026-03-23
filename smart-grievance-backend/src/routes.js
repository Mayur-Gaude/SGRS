import express from 'express';
import authRoutes from "./modules/auth/auth.routes.js";
import departmentRoutes from "./modules/department/department.routes.js";
import areaRoutes from "./modules/area/area.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import complaintRoutes from "./modules/complaint/complaint.routes.js";
import feedbackRoutes from "./modules/feedback/feedback.routes.js";
import reopenRoutes from "./modules/reopen/reopen.routes.js";

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Grievance API is running',
    });
});

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/areas", areaRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/complaints", complaintRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/reopen", reopenRoutes);
export default router;




