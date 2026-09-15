import { Router } from 'express';
import {
  listInternships,
  getInternshipById,
  applyInternship
} from '../controllers/internship.controller.js';
import { uploadCv } from '../middlewares/upload.middleware.js';
import { formSubmissionLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// GET /api/v1/internships
router.get('/', listInternships);

// GET /api/v1/internships/:id
router.get('/:id', getInternshipById);

// POST /api/v1/internships/apply
router.post('/apply', formSubmissionLimiter, uploadCv.single('cv'), applyInternship);

export default router;
