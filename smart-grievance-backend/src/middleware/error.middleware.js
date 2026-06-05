const errorHandler = (err, req, res, next) => {

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File too large. Max 5MB allowed",
        });
    }

    // Multer invalid file type error
    if (err.message === "Only images, videos and pdf allowed") {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : null,
    });
};

export default errorHandler;