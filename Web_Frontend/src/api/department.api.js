import API from "./axios";

// Create
export const createDepartment = (data) =>
    API.post("/departments", data);

// Get all
export const getDepartments = () =>
    API.get("/departments");

// Get by ID
export const getDepartmentById = (id) =>
    API.get(`/departments/${id}`);

// Update
export const updateDepartment = (id, data) =>
    API.put(`/departments/${id}`, data);

// Deactivate
export const deactivateDepartment = (id) =>
    API.patch(`/departments/${id}/deactivate`);

//Activate
export const activateDepartment = (id) =>
    API.patch(`/departments/${id}/activate`);