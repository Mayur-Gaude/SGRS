import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";
import Department from "../../models/department.model.js";
import Area from "../../models/area.model.js";
import { sendDepartmentAdminCredentialsEmail } from "../../services/email.service.js";

export const createDepartmentAdmin = async (data) => {
    const {
        full_name,
        email,
        phone,
        password,
        department_id,
        area_ids,
    } = data;

    const existing = await User.findOne({
        $or: [{ email }, { phone }],
    });

    if (existing) throw new Error("User already exists");

    const department = await Department.findById(department_id);
    if (!department) throw new Error("Department not found");

    // Validate areas
    if (area_ids && area_ids.length > 0) {
        const areas = await Area.find({
            _id: { $in: area_ids },
            department_id,
        });

        if (areas.length !== area_ids.length)
            throw new Error("Invalid area assignment");
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
        full_name,
        email,
        phone,
        password_hash: hashed,
        role: "DEPT_ADMIN",
        department_id,
        area_ids,
        email_verified: true,
        phone_verified: true,
    });

    // Do not fail admin creation if email sending fails.
    try {
        await sendDepartmentAdminCredentialsEmail({
            email,
            full_name,
            password,
            department_name: department.name,
        });
    } catch (e) {
        console.error("Failed to send admin credentials email", e?.message || e);
    }

    return admin;
};

export const getAllDepartmentAdmins = async () => {
    return User.find({ role: "DEPT_ADMIN" })
        .populate("department_id", "name")
        .populate("area_ids", "name pincode ward");
};

export const updateDepartmentAdminAreas = async (
    admin_id,
    area_ids
) => {
    const admin = await User.findById(admin_id);
    if (!admin || admin.role !== "DEPT_ADMIN")
        throw new Error("Admin not found");

    const areas = await Area.find({
        _id: { $in: area_ids },
        department_id: admin.department_id,
    });

    if (areas.length !== area_ids.length)
        throw new Error("Invalid area assignment");

    admin.area_ids = area_ids;
    await admin.save();

    return admin;
};

export const deactivateDepartmentAdmin = async (admin_id) => {
    const admin = await User.findByIdAndUpdate(
        admin_id,
        { is_active: false },
        { new: true }
    );

    if (!admin) throw new Error("Admin not found");

    return admin;
};