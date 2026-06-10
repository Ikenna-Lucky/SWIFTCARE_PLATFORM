import multer from "multer";
import path from "path";

/**
 * Allowed MIME types for image uploads.
 * Any file outside this list is rejected before it touches disk.
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/** Maximum upload size: 5 MB */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Disk storage — stores in the OS temp directory.
 * Cloudinary reads the file from disk, then we can delete it.
 * Uses a timestamp + random suffix instead of the original filename
 * to prevent path-traversal attacks and filename collisions.
 */
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

/**
 * File filter — rejects anything that isn't an allowed image type.
 * Called before the file is written to disk.
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type "${file.mimetype}". Only JPEG, PNG, and WebP images are allowed.`,
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

export default upload;
