import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiError.js';

// Ensure upload directory exists
const uploadDir = path.resolve('uploads/cvs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  }
});

// Allowed MIME types and extensions for CVs
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Multer instance for CV upload
export const uploadCv = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_MIME_TYPES.includes(mimeType)) {
      cb(null, true);
    } else {
      cb(
        ApiError.badRequest(
          'Invalid file type. Only PDF, DOC, and DOCX files are allowed for CV upload.'
        ),
        false
      );
    }
  }
});
