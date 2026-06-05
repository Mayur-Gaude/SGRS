import {
    getDepartmentAnalytics,
    getSLAMetrics,
    getResolutionMetrics,
    getAreaAnalytics,
    getCategoryAnalytics,
    generateAnalyticsReport,
    getReports,
    getAdminPerformance,
} from "../../services/analytics.service.js";
import Complaint from "../../models/complaint.model.js";
import { successResponse } from "../../utils/response.js";


// 📊 Department Dashboard
export const getDepartmentDashboard = async (req, res, next) => {
    try {

        const { departmentId } = req.params;

        const stats = await getDepartmentAnalytics(departmentId);
        const sla = await getSLAMetrics(departmentId);
        const resolution = await getResolutionMetrics(departmentId);

        return successResponse(res, {
            stats,
            sla,
            resolution,
        });

    } catch (error) {
        next(error);
    }
};


// 🌍 System Overview
export const getSystemOverview = async (req, res, next) => {
    try {

        const total = await Complaint.countDocuments();

        const resolved = await Complaint.countDocuments({ status: "RESOLVED" });
        const pending = await Complaint.countDocuments({
            status: { $in: ["SUBMITTED", "UNDER_REVIEW"] },
        });

        return successResponse(res, {
            total,
            resolved,
            pending,
        });

    } catch (error) {
        next(error);
    }
};

// Area API
export const getAreaInsights = async (req, res, next) => {
    try {

        const data = await getAreaAnalytics();

        return successResponse(res, data);

    } catch (error) {
        next(error);
    }
};

// Category API
export const getCategoryInsights = async (req, res, next) => {
    try {

        const data = await getCategoryAnalytics();

        return successResponse(res, data);

    } catch (error) {
        next(error);
    }
};

// Generate Report API
export const generateReport = async (req, res, next) => {
    try {

        const { departmentId, report_period } = req.body;

        const report = await generateAnalyticsReport({
            departmentId,
            report_period,
            generated_by: req.user._id,
        });

        return successResponse(res, report);

    } catch (error) {
        next(error);
    }
};

//get Report API
export const getDepartmentReports = async (req, res, next) => {
    try {

        const reports = await getReports(req.params.departmentId);

        return successResponse(res, reports);

    } catch (error) {
        next(error);
    }
};

//Admin Performance API
export const getAdminPerformanceStats = async (req, res, next) => {
    try {

        const { adminId } = req.params;

        const data = await getAdminPerformance(adminId);

        return successResponse(res, data);

    } catch (error) {
        next(error);
    }
};