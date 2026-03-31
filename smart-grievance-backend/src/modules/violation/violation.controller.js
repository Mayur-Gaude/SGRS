import * as service from "./violation.service.js";
import { successResponse } from "../../utils/response.js";

export const createViolation = async (req, res, next) => {
    try {
        const result = await service.createViolation(
            req.body,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};