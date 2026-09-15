import { Router } from 'express';
import { submitVolunteerApplication } from '../controllers/volunteer.controller.js';
import { formSubmissionLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { volunteerApplicationSchema } from '../utils/validators.js';

const router = Router();

// POST /api/v1/volunteers/apply
router.post(
  '/apply',
  formSubmissionLimiter,
  validateBody(volunteerApplicationSchema),
  submitVolunteerApplication
);

export default router;
