import API from "./axios";

// Create
export const createArea = (data) =>
    API.post("/areas", data);

// Get all
export const getAreas = () =>
    API.get("/areas");

// Get by ID
export const getAreaById = (id) =>
    API.get(`/areas/${id}`);

// Update
export const updateArea = (id, data) =>
    API.put(`/areas/${id}`, data);

// Deactivate
export const deactivateArea = (id) =>
    API.patch(`/areas/${id}/deactivate`);