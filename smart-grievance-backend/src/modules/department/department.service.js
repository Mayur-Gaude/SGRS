import Department from "../../models/department.model.js";

export const createDepartment = async (data, user) => {
    const existing = await Department.findOne({ code: data.code });
    if (existing) throw new Error("Department code already exists");

    const department = await Department.create({
        ...data,
        created_by: user._id,
    });

    return department;
};

export const getAllDepartments = async () => {
    return Department.find().sort({ createdAt: -1 });
};

export const getDepartmentById = async (id) => {
    const dept = await Department.findById(id);
    if (!dept) throw new Error("Department not found");
    return dept;
};

export const updateDepartment = async (id, data) => {
    const dept = await Department.findByIdAndUpdate(id, data, {
        new: true,
    });

    if (!dept) throw new Error("Department not found");
    return dept;
};

export const deactivateDepartment = async (id) => {
    const dept = await Department.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
    );

    if (!dept) throw new Error("Department not found");
    return dept;
};