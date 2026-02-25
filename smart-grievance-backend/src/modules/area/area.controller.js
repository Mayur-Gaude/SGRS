import * as service from "./area.service.js";
import { successResponse } from "../../utils/response.js";

export const createArea = async (req, res, next) => {
    try {
        const result = await service.createArea(req.body);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getAllAreas = async (req, res, next) => {
    try {
        const result = await service.getAllAreas();
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getAreaById = async (req, res, next) => {
    try {
        const result = await service.getAreaById(req.params.id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const updateArea = async (req, res, next) => {
    try {
        const result = await service.updateArea(
            req.params.id,
            req.body
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const deactivateArea = async (req, res, next) => {
    try {
        const result = await service.deactivateArea(
            req.params.id
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};