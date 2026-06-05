import * as service from "./ban.service.js";
import { successResponse } from "../../utils/response.js";

// export const createBan = async (req, res, next) => {
//     try {

//         const result = await service.createBan(
//             req.body,
//             req.user
//         );

//         return successResponse(res, result);

//     } catch (error) {
//         next(error);
//     }
// };

// export const getMyBan = async (
//     req,
//     res,
//     next
// ) => {
//     try {

//         const result =
//             await service.getMyBan(req.user);

//         return successResponse(res, result);

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };



export const createBan = async (
    req,
    res,
    next
) => {
    try {

        const result =
            await service.createBan(
                req.body,
                req.user
            );

        return successResponse(
            res,
            result
        );

    } catch (error) {
        next(error);
    }
};

export const getMyBan = async (
    req,
    res,
    next
) => {
    try {

        const result =
            await service.getMyBan(
                req.user
            );

        // if (!result) {
        //     return res.status(404).json({ message: "No active ban found" });
        // }

        if (result.status === "NOT_FOUND") {
            return res.status(404).json({ message: "No active ban found" });
        }

        if (result.status === "EXPIRED") {
            return res.status(200).json({ message: "Ban expired", data: null });
        }
        return successResponse(
            res,
            result
        );

    } catch (error) {
        next(error);
    }
};