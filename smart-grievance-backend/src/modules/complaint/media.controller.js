import * as service from "./media.service.js";
import { successResponse } from "../../utils/response.js";

export const uploadMedia = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await service.uploadComplaintMedia(
                req.params.id,
                req.file,
                req.user
            );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getMedia = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await service.getComplaintMedia(
                req.params.id
            );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};