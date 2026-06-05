import * as service from "./appeal.service.js";
import { successResponse } from "../../utils/response.js";

export const createAppeal = async (req, res, next) => {
    try {

        const { reason } = req.body;

        if (!reason) {
            throw new Error("Appeal reason is required");
        }

        const result = await service.createAppeal(
            req.params.id,
            reason,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};


export const reviewAppeal = async (req, res, next) => {
    try {

        const { decision } = req.body;

        if (!["APPROVED", "REJECTED"].includes(decision)) {
            throw new Error("Invalid decision");
        }

        const result = await service.reviewAppeal(
            req.params.id,
            decision,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};