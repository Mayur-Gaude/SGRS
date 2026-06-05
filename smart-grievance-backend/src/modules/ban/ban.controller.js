import * as service from "./ban.service.js";
import { successResponse } from "../../utils/response.js";

export const createBan = async (req, res, next) => {
    try {

        const result = await service.createBan(
            req.body,
            req.user
        );

        return successResponse(res, result);

    } catch (error) {
        next(error);
    }
};