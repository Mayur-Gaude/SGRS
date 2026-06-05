import Complaint from "../models/complaint.model.js";
import Analytics from "../models/analytics.model.js";

// 1. Department Analytics
export const getDepartmentAnalytics = async (departmentId) => {

    const complaints = await Complaint.find({
        department_id: departmentId,
    });

    const total = complaints.length;

    const resolved = complaints.filter(c => c.status === "RESOLVED").length;
    const pending = complaints.filter(c => ["SUBMITTED", "UNDER_REVIEW"].includes(c.status)).length;
    const rejected = complaints.filter(c => c.status === "REJECTED").length;
    const reopened = complaints.filter(c => c.status === "REOPENED").length;

    return {
        total,
        resolved,
        pending,
        rejected,
        reopened,
    };
};


// 📈 SLA Metrics
export const getSLAMetrics = async (departmentId) => {

    const complaints = await Complaint.find({
        department_id: departmentId,
    });

    const total = complaints.length || 1;

    const responseMet = complaints.filter(c => c.sla_response_met).length;
    const resolutionMet = complaints.filter(c => c.sla_resolution_met).length;

    return {
        responseCompliance: ((responseMet / total) * 100).toFixed(2),
        resolutionCompliance: ((resolutionMet / total) * 100).toFixed(2),
    };
};


// ⏱ Resolution Metrics
export const getResolutionMetrics = async (departmentId) => {

    const resolvedComplaints = await Complaint.find({
        department_id: departmentId,
        status: "RESOLVED",
        resolved_at: { $ne: null },
    });

    if (resolvedComplaints.length === 0) {
        return {
            avgResolutionTime: 0,
        };
    }

    const totalTime = resolvedComplaints.reduce((sum, c) => {
        const created = new Date(c.created_at);
        const resolved = new Date(c.resolved_at);

        const diffHours = (resolved - created) / (1000 * 60 * 60);
        return sum + diffHours;
    }, 0);

    return {
        avgResolutionTime: (totalTime / resolvedComplaints.length).toFixed(2),
    };
};


// 2. Area Analytics
export const getAreaAnalytics = async () => {

    const complaints = await Complaint.find();

    const areaMap = {};

    complaints.forEach(c => {
        const area = c.area_id?.toString() || "UNKNOWN";

        if (!areaMap[area]) {
            areaMap[area] = 0;
        }

        areaMap[area]++;
    });

    // Convert to array
    const result = Object.keys(areaMap).map(area => ({
        area_id: area,
        complaintCount: areaMap[area],
    }));

    // Sort descending
    result.sort((a, b) => b.complaintCount - a.complaintCount);

    return result;
};

//  Category Analytics
export const getCategoryAnalytics = async () => {

    const complaints = await Complaint.find();

    const categoryMap = {};

    complaints.forEach(c => {
        const category = c.category_id?.toString() || "UNKNOWN";

        if (!categoryMap[category]) {
            categoryMap[category] = {
                count: 0,
                highPriority: 0,
            };
        }

        categoryMap[category].count++;

        if (c.priority === "HIGH" || c.priority === "CRITICAL") {
            categoryMap[category].highPriority++;
        }
    });

    const result = Object.keys(categoryMap).map(cat => ({
        category_id: cat,
        total: categoryMap[cat].count,
        highPriority: categoryMap[cat].highPriority,
    }));

    result.sort((a, b) => b.total - a.total);

    return result;
};


// 3. Generate Report
export const generateAnalyticsReport = async ({
    departmentId,
    report_period,
    generated_by,
}) => {

    const complaints = await Complaint.find({
        department_id: departmentId,
    });

    const total = complaints.length;

    const resolved = complaints.filter(c => c.status === "RESOLVED").length;
    const pending = complaints.filter(c =>
        ["SUBMITTED", "UNDER_REVIEW"].includes(c.status)
    ).length;

    // ⏱ Avg Resolution Time
    const resolvedComplaints = complaints.filter(
        c => c.status === "RESOLVED" && c.resolved_at
    );

    let avgResolution = 0;

    if (resolvedComplaints.length > 0) {
        const totalTime = resolvedComplaints.reduce((sum, c) => {
            const diff =
                (new Date(c.resolved_at) - new Date(c.created_at)) /
                (1000 * 60 * 60);
            return sum + diff;
        }, 0);

        avgResolution = totalTime / resolvedComplaints.length;
    }

    // 📈 SLA Compliance
    const slaMet = complaints.filter(c => c.sla_resolution_met).length;
    const slaCompliance =
        total === 0 ? 0 : (slaMet / total) * 100;

    // 💾 Save Report
    const report = await Analytics.create({
        department_id: departmentId,
        total_complaints: total,
        resolved_complaints: resolved,
        pending_complaints: pending,
        avg_resolution_hours: avgResolution,
        sla_compliance_percent: slaCompliance,
        report_period,
        report_date: new Date(),
        generated_by,
    });

    return report;
};

// get service reports
export const getReports = async (departmentId) => {
    return await Analytics.find({ department_id: departmentId })
        .sort({ report_date: -1 });
};


// 4. Admin Performance Analytics
export const getAdminPerformance = async (adminId) => {

    const complaints = await Complaint.find({
        assigned_admin_id: adminId,
    });

    const totalAssigned = complaints.length;

    const resolved = complaints.filter(c => c.status === "RESOLVED").length;

    const pending = complaints.filter(c =>
        ["SUBMITTED", "UNDER_REVIEW"].includes(c.status)
    ).length;

    const escalations = complaints.filter(c => c.is_escalated).length;

    // ⏱ Avg Resolution Time
    const resolvedComplaints = complaints.filter(
        c => c.status === "RESOLVED" && c.resolved_at
    );

    let avgResolutionTime = 0;

    if (resolvedComplaints.length > 0) {
        const totalTime = resolvedComplaints.reduce((sum, c) => {
            const diff =
                (new Date(c.resolved_at) - new Date(c.created_at)) /
                (1000 * 60 * 60);

            return sum + diff;
        }, 0);

        avgResolutionTime =
            totalTime / resolvedComplaints.length;
    }

    // 📈 SLA Compliance
    const slaMet = complaints.filter(c => c.sla_resolution_met).length;

    const slaCompliance =
        totalAssigned === 0
            ? 0
            : (slaMet / totalAssigned) * 100;

    return {
        totalAssigned,
        resolved,
        pending,
        avgResolutionTime: avgResolutionTime.toFixed(2),
        slaCompliance: slaCompliance.toFixed(2),
        escalations,
    };
};