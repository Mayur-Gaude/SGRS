import API from './axios';

export const createAppeal = (banId, reason) =>
    API.post(`/appeals/${banId}`, { reason });


export const createViolation = (data) =>
    API.post("/violations", data);

export const createBan = (data) =>
    API.post("/bans", data);

export const getAppeals = () =>
    API.get("/appeals");

export const reviewAppeal = (
    id,
    decision
) =>
    API.patch(`/appeals/review/${id}`, {
        decision,
    });

export const getViolations = () =>
    API.get("/violations");

export const getViolationManagement = () =>
    API.get("/violations/management");

export const getViolationById = (id) =>
    API.get(`/violations/${id}`);

export const getMyBan = () =>
    API.get("/bans/my-ban");