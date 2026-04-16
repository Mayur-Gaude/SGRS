//deparment.controller.js
import * as service from "./department.service.js";
import { successResponse } from "../../utils/response.js";

export const createDepartment = async (req, res, next) => {
    try {
        const result = await service.createDepartment(req.body, req.user);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getAllDepartments = async (req, res, next) => {
    try {
        const result = await service.getAllDepartments();
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getDepartmentById = async (req, res, next) => {
    try {
        const result = await service.getDepartmentById(req.params.id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req, res, next) => {
    try {
        const result = await service.updateDepartment(
            req.params.id,
            req.body
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const deactivateDepartment = async (req, res, next) => {
    try {
        const result = await service.deactivateDepartment(
            req.params.id
        );
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const activateDepartment = async (req, res, next) => {
    try {
        const result = await service.activateDepartment(req.params.id);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};