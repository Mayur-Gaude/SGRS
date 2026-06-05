import * as service from "./category.service.js";
import { successResponse } from "../../utils/response.js";

export const createCategory = async (req, res, next) => {
    try {
        const result = await service.createCategory(req.body);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const result = await service.getAllCategories();
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getCategoriesByDepartment = async (req, res, next) => {
    try {
        const result = await service.getCategoriesByDepartment(
            req.params.department_id
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const result = await service.getCategoryById(req.params.id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const result = await service.updateCategory(
            req.params.id,
            req.body
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const deactivateCategory = async (req, res, next) => {
    try {
        const result = await service.deactivateCategory(
            req.params.id
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};