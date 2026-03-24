import * as service from "./complaint.service.js";
import { successResponse } from "../../utils/response.js";


// ======================================================
// 1️⃣ SUBMIT COMPLAINT
// ======================================================

export const submitComplaint = async (req, res, next) => {
    try {
        const result = await service.submitComplaint(
            req.body,
            req.user
        );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};


// ======================================================
// 2️⃣ GET COMPLAINT LIST
// ======================================================

export const getComplaints = async (req, res, next) => {
    try {
        const result = await service.getComplaints(
            req.user
        );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};


// ======================================================
// 3️⃣ GET COMPLAINT FORM METADATA
// ======================================================

export const getComplaintMeta = async (req, res, next) => {
    try {
        const result = await service.getComplaintMeta();

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};


// ======================================================
// 4️⃣ GET COMPLAINT DETAILS
// ======================================================

export const getComplaintById = async (req, res, next) => {
    try {
        const result =
            await service.getComplaintById(
                req.params.id,
                req.user
            );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};