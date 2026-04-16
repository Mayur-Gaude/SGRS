import API from "./axios";

export const createComplaint = (data) =>
    API.post("/complaints", data);

export const getUserComplaints = () =>
    API.get("/complaints");

export const getComplaintById = (id) =>
    API.get(`/complaints/${id}`);

export const uploadComplaintMedia = (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return API.post(`/complaints/${id}/media`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAssignedComplaints = () =>
    API.get("/complaints/assigned");

export const updateComplaintStatus = (id, status) =>
    API.patch(`/complaints/${id}/status`, { status });

export const addRemark = (id, remark) =>
    API.post(`/complaints/${id}/remarks`, { remark });

export const resolveComplaint = (id, resolutionRemark) =>
    API.patch(`/complaints/${id}/resolve`, { resolutionRemark });

export const getComplaintDetails = (id) =>
    API.get(`/complaints/${id}`);

export const getComplaintMedia = (id) =>
    API.get(`/complaints/${id}/media`);