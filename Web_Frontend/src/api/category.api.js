import API from "./axios";

// Create
export const createCategory = (data) =>
    API.post("/categories", data);

// Get all
export const getCategories = () =>
    API.get("/categories");

// Get by ID
export const getCategoryById = (id) =>
    API.get(`/categories/${id}`);

// Update
export const updateCategory = (id, data) =>
    API.put(`/categories/${id}`, data);

// Deactivate
export const deactivateCategory = (id) =>
    API.patch(`/categories/${id}/deactivate`);

// Get by department
export const getCategoriesByDepartment = (departmentId) =>
    API.get(`/categories/department/${departmentId}`);