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

export const updateComplaintStatus = (id, status, rejection_reason = null) =>
    API.patch(`/complaints/${id}/status`, { status, rejection_reason });

export const addRemark = (id, remark) =>
    API.post(`/complaints/${id}/remarks`, { remark });

export const resolveComplaint = (id, resolutionRemark) =>
    API.patch(`/complaints/${id}/resolve`, { resolutionRemark });

export const getComplaintDetails = (id) =>
    API.get(`/complaints/${id}`);

export const getComplaintMedia = (id) =>
    API.get(`/complaints/${id}/media`);

// ⭐ FEEDBACK
export const submitFeedback = (id, data) =>
    API.post(`/feedback/${id}`, data);

// 🔁 REOPEN (USER)
export const requestReopen = (id, reason) =>
    API.post(`/reopen/${id}`, { reason });

// 🔁 REOPEN REVIEW (ADMIN)
export const reviewReopen = (reopenId, decision) =>
    API.patch(`/reopen/review/${reopenId}`, { decision });

export const getReopenRequests = () =>
    API.get("/reopen");

// export const reviewReopen = (id, decision) =>
//     API.patch(`/reopen/review/${id}`, { decision });