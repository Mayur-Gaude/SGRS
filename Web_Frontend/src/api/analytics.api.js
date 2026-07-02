import API from "./axios";

// SUPER ADMIN
export const getOverview = () =>
    API.get("/analytics/overview");

export const getAreaAnalytics = () =>
    API.get("/analytics/areas");

export const getCategoryAnalytics = () =>
    API.get("/analytics/categories");

// DEPARTMENT
export const getDepartmentAnalytics = (
    departmentId
) =>
    API.get(
        `/analytics/department/${departmentId}`
    );

// REPORTS
export const generateReport = (data) =>
    API.post("/analytics/generate", data);

export const getReports = (
    departmentId
) =>
    API.get(
        `/analytics/reports/${departmentId}`
    );

// ADMIN PERFORMANCE
export const getAdminPerformance = (
    adminId
) =>
    API.get(`/analytics/admin/${adminId}`);