//complaint.controller.js
import * as service from "./complaint.service.js";
import { successResponse } from "../../utils/response.js";
import * as remarkService from "./complaintRemark.service.js";
import * as resolutionService from "./complaintResolution.service.js";
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
// 3️⃣ GET COMPLAINT DETAILS
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

// ======================================================
// 4️⃣ GET ASSIGNED COMPLAINTS (FOR DEPT ADMINS)
// ======================================================   
export const getAssignedComplaints = async (req, res, next) => {
    try {

        const result = await service.getAssignedComplaints(req.user);

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};

// ======================================================
// 5️⃣ UPDATE COMPLAINT STATUS (BY DEPT_ADMIN)
// ======================================================
export const updateComplaintStatus = async (req, res, next) => {
    try {

        const { status } = req.body;

        const result = await service.updateComplaintStatus(
            req.params.id,
            status,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};



export const addRemark = async (req, res, next) => {
    try {

        const { remark } = req.body;

        if (!remark) {
            throw new Error("Remark is required");
        }

        const result = await remarkService.addAdminRemark(
            req.params.id,
            remark,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};



export const resolveComplaint = async (req, res, next) => {
    try {

        const { resolutionRemark } = req.body;

        if (!resolutionRemark) {
            throw new Error("Resolution remark is required");
        }

        const result = await resolutionService.resolveComplaint(
            req.params.id,
            resolutionRemark,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};