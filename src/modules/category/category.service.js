//category.service.js
import Category from "../../models/category.model.js";
import Department from "../../models/department.model.js";

export const createCategory = async (data) => {
    const department = await Department.findById(data.department_id);
    if (!department) throw new Error("Department not found");

    const category = await Category.create(data);
    return category;
};

export const getAllCategories = async () => {
    return Category.find()
        .populate("department_id", "name code")
        .sort({ createdAt: -1 });
};

export const getCategoriesByDepartment = async (department_id) => {
    return Category.find({ department_id, is_active: true });
};

export const getCategoryById = async (id) => {
    const category = await Category.findById(id)
        .populate("department_id", "name");

    if (!category) throw new Error("Category not found");
    return category;
};

export const updateCategory = async (id, data) => {
    const category = await Category.findByIdAndUpdate(id, data, {
        // new: true,
        returnDocument: "after"
    });

    if (!category) throw new Error("Category not found");
    return category;
};

export const deactivateCategory = async (id) => {
    const category = await Category.findByIdAndUpdate(
        id,
        { is_active: false },
        // { new: true }
        { returnDocument: "after" }
    );

    if (!category) throw new Error("Category not found");
    return category;
};