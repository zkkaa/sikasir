import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file dengan timestamp
  },
});

// Filter hanya untuk gambar
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Ekspor konfigurasi multer
export const upload = multer({ storage, fileFilter });
