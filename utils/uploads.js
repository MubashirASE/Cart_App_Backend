import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload folder ka path
const uploadPath = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Upload folder path
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // File extension
    cb(null, Date.now() + ext); // e.g., 1691154890000.png
  },
});

export const upload = multer({ storage });
