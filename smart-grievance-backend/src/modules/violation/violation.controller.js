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

export const getViolations = async (
    req,
    res,
    next
) => {
    try {

        const result = await service.getViolations(
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        // console.log(error);
        next(error);
    }
};

export const getViolationManagement = async (
    req,
    res,
    next
) => {
    try {

        const result =
            await service.getViolationManagement();

        return successResponse(res, result);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getViolationById = async (
    req,
    res,
    next
) => {
    try {

        const result =
            await service.getViolationById(
                req.params.id
            );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};