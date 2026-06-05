import * as service from "./feedback.service.js";

export const submitFeedback = async (req, res, next) => {
    try {

        const { rating, comment } = req.body;

        if (!rating) {
            throw new Error("Rating is required");
        }

        const result = await service.submitFeedback(
            req.params.id,
            rating,
            comment,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Feedback submitted successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};