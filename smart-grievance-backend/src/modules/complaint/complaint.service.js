import Complaint from "../../models/complaint.model.js";
import ComplaintTimeline from "../../models/complaintTimeline.model.js";
import Department from "../../models/department.model.js";
import Area from "../../models/area.model.js";
import Category from "../../models/category.model.js";
import User from "../../models/user.model.js";
import { assignComplaint } from "../../services/assignment.service.js";

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
    let complaint = await Complaint.create({
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

    // Auto assignment engine
    complaint = await assignComplaint(complaint);

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
// 3️⃣ GET SINGLE COMPLAINT DETAILS
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

// ======================================================
// 4️⃣ GET COMPLAINTS ASSIGNED TO CURRENT DEPT_ADMIN
// ======================================================
export const getAssignedComplaints = async (currentUser) => {

    if (currentUser.role !== "DEPT_ADMIN") {
        throw new Error("Only department admins can access assigned complaints");
    }

    const complaints = await Complaint.find({
        assigned_admin_id: currentUser._id
    })
        .populate("user_id", "full_name email phone")
        .populate("department_id", "name")
        .populate("area_id", "name")
        .populate("category_id", "name priority")
        .sort({ createdAt: -1 });

    return complaints;
};

// ======================================================
// 5️⃣ UPDATE COMPLAINT STATUS (BY DEPT_ADMIN)
// ======================================================
export const updateComplaintStatus = async (
    complaintId,
    status,
    currentUser
) => {

    if (currentUser.role !== "DEPT_ADMIN") {
        throw new Error("Only department admins can update status");
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
        throw new Error("Complaint not found");
    }

    if (
        complaint.assigned_admin_id?.toString() !==
        currentUser._id.toString()
    ) {
        throw new Error("Unauthorized to update this complaint");
    }

    const allowedStatus = [
        "UNDER_REVIEW",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED"
    ];

    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status update");
    }

    complaint.status = status;

    await complaint.save();

    // Create timeline event
    await ComplaintTimeline.create({
        complaint_id: complaint._id,
        action: "STATUS_UPDATED",
        description: `Status updated to ${status}`,
        performed_by: currentUser._id,
        role: currentUser.role
    });

    return complaint;
};