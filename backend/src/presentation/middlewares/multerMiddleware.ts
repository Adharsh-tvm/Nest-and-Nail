import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    }
    cb(null, true);
  }
});
