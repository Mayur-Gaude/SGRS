import express from 'express';
import authRoutes from "./modules/auth/auth.routes.js";

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Grievance API is running',
    });
});

router.use("/auth", authRoutes);

export default router;




