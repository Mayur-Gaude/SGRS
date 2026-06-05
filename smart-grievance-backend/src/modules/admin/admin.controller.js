import * as service from "./admin.service.js";
import { successResponse } from "../../utils/response.js";

export const createDepartmentAdmin = async (req, res, next) => {
    try {
        const result = await service.createDepartmentAdmin(
            req.body
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getAllDepartmentAdmins = async (
    req,
    res,
    next
) => {
    try {
        const result = await service.getAllDepartmentAdmins();
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const updateDepartmentAdminAreas = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await service.updateDepartmentAdminAreas(
                req.params.id,
                req.body.area_ids
            );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const deactivateDepartmentAdmin = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await service.deactivateDepartmentAdmin(
                req.params.id
            );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};