import * as service from "./reopen.service.js";
import { successResponse } from "../../utils/response.js";

export const requestReopen = async (req, res, next) => {
    try {

        const { reason } = req.body;

        if (!reason) throw new Error("Reason is required");

        const result = await service.requestReopen(
            req.params.id,
            reason,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};


export const reviewReopen = async (req, res, next) => {
    try {

        const { decision } = req.body;

        if (!["APPROVED", "REJECTED"].includes(decision)) {
            throw new Error("Invalid decision");
        }

        const result = await service.reviewReopenRequest(
            req.params.id,
            decision,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};