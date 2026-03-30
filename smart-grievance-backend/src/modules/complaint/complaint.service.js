import Complaint from "../../models/complaint.model.js";
import ComplaintTimeline from "../../models/complaintTimeline.model.js";
import Department from "../../models/department.model.js";
import Area from "../../models/area.model.js";
import Category from "../../models/category.model.js";
import User from "../../models/user.model.js";
import { isPointInsidePolygon } from "../../utils/geofence.js";

import { generateComplaintNumber } from "../../services/complaintNumber.service.js";
import { calculateSLA } from "../../services/sla.service.js";


// ======================================================
// 1️⃣ SUBMIT COMPLAINT
// ======================================================

export const submitComplaint = async (data, currentUser) => {
    const {
        department_id,
        area_id,
        category_id,
        title,
        description,
        latitude,
        longitude,
        pincode,
    } = data;

    // Validate Department
    const department = await Department.findById(department_id);
    if (!department) throw new Error("Department not found");

    // Validate Area
    const area = await Area.findById(area_id);
    if (!area || area.department_id.toString() !== department_id)
        throw new Error("Invalid area selected");

    const hasAreaPolygon =
        area?.geo_boundary?.type === "Polygon" &&
        Array.isArray(area?.geo_boundary?.coordinates) &&
        area.geo_boundary.coordinates.length > 0;

    if (hasAreaPolygon) {
        if (latitude === undefined || longitude === undefined) {
            throw new Error("Location is required for this service area");
        }

        const isInside = isPointInsidePolygon(
            Number(latitude),
            Number(longitude),
            area.geo_boundary.coordinates[0]
        );

        if (!isInside) {
            throw new Error("Selected location is outside this service area boundary");
        }
    }

    // Validate Category
    const category = await Category.findById(category_id);
    if (!category || category.department_id.toString() !== department_id)
        throw new Error("Invalid category selected");

    // Generate Complaint Number
    const complaintNumber = await generateComplaintNumber();

    // Calculate SLA
    const { responseDeadline, resolutionDeadline } =
        calculateSLA(category);

    // Create Complaint
    const complaint = await Complaint.create({
        complaint_number: complaintNumber,
        user_id: currentUser._id,
        department_id,
        area_id,
        category_id,
        title,
        description,
        latitude,
        longitude,
        pincode,
        priority: category.priority,
        sla_response_deadline: responseDeadline,
        sla_resolution_deadline: resolutionDeadline,
    });

    // Create Timeline Entry
    await ComplaintTimeline.create({
        complaint_id: complaint._id,
        action: "SUBMITTED",
        description: "Complaint submitted by user",
        performed_by: currentUser._id,
        role: currentUser.role,
    });

    return complaint;
};



// ======================================================
// 2️⃣ GET COMPLAINT LIST (ROLE BASED)
// ======================================================

export const getComplaints = async (currentUser) => {
    // USER → only their complaints
    if (currentUser.role === "USER") {
        return Complaint.find({ user_id: currentUser._id })
            .populate("department_id", "name")
            .populate("area_id", "name")
            .populate("category_id", "name")
            .sort({ createdAt: -1 });
    }

    // DEPT_ADMIN → complaints from assigned areas
    if (currentUser.role === "DEPT_ADMIN") {
        return Complaint.find({
            area_id: { $in: currentUser.area_ids },
        })
            .populate("user_id", "full_name")
            .populate("department_id", "name")
            .populate("area_id", "name")
            .populate("category_id", "name")
            .sort({ createdAt: -1 });
    }

    // SUPER_ADMIN → all complaints
    if (currentUser.role === "SUPER_ADMIN") {
        return Complaint.find()
            .populate("user_id", "full_name")
            .populate("department_id", "name")
            .populate("area_id", "name")
            .populate("category_id", "name")
            .sort({ createdAt: -1 });
    }

    throw new Error("Unauthorized");
};


// ======================================================
// 3️⃣ GET COMPLAINT FORM METADATA
// ======================================================

export const getComplaintMeta = async () => {
    const [departments, areas, categories] = await Promise.all([
        Department.find({ is_active: true })
            .select("_id name code")
            .sort({ name: 1 }),
        Area.find({ is_active: true })
            .select("_id name department_id pincode ward geo_boundary")
            .sort({ name: 1 }),
        Category.find({ is_active: true })
            .select("_id name department_id priority")
            .sort({ name: 1 }),
    ]);

    return {
        departments,
        areas,
        categories,
    };
};



// ======================================================
// 4️⃣ GET SINGLE COMPLAINT DETAILS
// ======================================================

export const getComplaintById = async (id, currentUser) => {
    const complaint = await Complaint.findById(id)
        .populate("user_id", "full_name email")
        .populate("department_id", "name")
        .populate("area_id", "name")
        .populate("category_id", "name priority")
        .populate("assigned_admin_id", "full_name");

    if (!complaint) throw new Error("Complaint not found");

    // Access control
    if (
        currentUser.role === "USER" &&
        complaint.user_id._id.toString() !==
        currentUser._id.toString()
    ) {
        throw new Error("Unauthorized access");
    }

    if (
        currentUser.role === "DEPT_ADMIN" &&
        !currentUser.area_ids.includes(complaint.area_id._id)
    ) {
        throw new Error("Unauthorized access");
    }

    const timeline = await ComplaintTimeline.find({
        complaint_id: id,
    }).sort({ createdAt: 1 });

    return {
        complaint,
        timeline,
    };
};