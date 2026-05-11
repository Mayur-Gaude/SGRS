import API from "./axios";

// Create admin
export const createAdmin = (data) =>
    API.post("/admin/department-admin", data);

// Get all
export const getAdmins = () =>
    API.get("/admin/department-admin");

// Update areas
export const updateAdminAreas = (id, area_ids) =>
    API.put(`/admin/department-admin/${id}/areas`, { area_ids });

// Deactivate
export const deactivateAdmin = (id) =>
    API.patch(`/admin/department-admin/${id}/deactivate`);

export const updateAdmin = (id, data) =>
    API.put(`/admin/department-admin/${id}`, data);

export const getAdminById = (id) =>
    API.get(`/admin/department-admin/${id}`);