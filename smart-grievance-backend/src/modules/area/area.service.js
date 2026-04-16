//area.service.js
import Area from "../../models/area.model.js";
import Department from "../../models/department.model.js";

export const createArea = async (data) => {
    const department = await Department.findById(data.department_id);
    if (!department) throw new Error("Department not found");

    let level = 1;

    if (data.parent_area_id) {
        const parent = await Area.findById(data.parent_area_id);
        if (!parent) throw new Error("Parent area not found");

        level = parent.level + 1;
    }

    const area = await Area.create({
        ...data,
        level,
    });

    return area;
};

export const getAllAreas = async () => {
    return Area.find()
        .populate("department_id", "name code")
        .populate("parent_area_id", "name")
        .sort({ createdAt: -1 });
};

export const getAreaById = async (id) => {
    const area = await Area.findById(id)
        .populate("department_id", "name")
        .populate("parent_area_id", "name");

    if (!area) throw new Error("Area not found");
    return area;
};

export const updateArea = async (id, data) => {
    const area = await Area.findByIdAndUpdate(id, data, {
        new: true,
    });

    if (!area) throw new Error("Area not found");
    return area;
};

export const deactivateArea = async (id) => {
    const area = await Area.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
    );

    if (!area) throw new Error("Area not found");
    return area;
};
