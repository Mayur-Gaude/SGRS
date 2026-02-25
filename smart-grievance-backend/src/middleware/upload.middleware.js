import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder if not exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes =
        /jpeg|jpg|png|mp4|pdf/;

    const ext =
        allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

    if (ext) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only images, videos and pdf allowed"
            )
        );
    }
};

export const upload = multer({
    storage,
    fileFilter,
});