import { Router } from 'express';
import { subscribeNewsletter } from '../controllers/newsletter.controller.js';
import { formSubmissionLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { subscribeSchema } from '../utils/validators.js';

const router = Router();

// POST /api/v1/newsletter/subscribe
router.post(
  '/subscribe',
  formSubmissionLimiter,
  validateBody(subscribeSchema),
  subscribeNewsletter
);

export default router;
