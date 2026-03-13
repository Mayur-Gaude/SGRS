import User from "../models/user.model.js";
import Area from "../models/area.model.js";
import Complaint from "../models/complaint.model.js";
import ComplaintTimeline from "../models/complaintTimeline.model.js";

/**
 * Find department admin for area (with hierarchy fallback)
 */
const findAdminForArea = async (department_id, area_id) => {

    let currentArea = await Area.findById(area_id);

    while (currentArea) {

        const admin = await User.findOne({
            role: "DEPT_ADMIN",
            department_id: department_id,
            area_ids: currentArea._id,
            is_active: true
        });

        if (admin) {
            return admin;
        }

        // Move to parent area if exists
        if (!currentArea.parent_area_id) break;

        currentArea = await Area.findById(currentArea.parent_area_id);
    }

    return null;
};


/**
 * Main Assignment Function
 */
export const assignComplaint = async (complaint) => {

    const admin = await findAdminForArea(
        complaint.department_id,
        complaint.area_id
    );

    // If no admin found → leave unassigned
    if (!admin) {
        return complaint;
    }

    // Update complaint
    complaint.assigned_admin_id = admin._id;
    complaint.status = "UNDER_REVIEW";

    await complaint.save();

    // Add timeline entry
    await ComplaintTimeline.create({
        complaint_id: complaint._id,
        action: "ASSIGNED",
        description: `Complaint assigned to ${admin.full_name}`,
        performed_by: admin._id,
        role: "SYSTEM"
    });

    return complaint;
};