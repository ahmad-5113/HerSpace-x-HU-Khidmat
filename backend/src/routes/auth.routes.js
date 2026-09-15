import { Router } from 'express';
import { login, register, verifyEmail, getMe } from '../controllers/auth.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';
import { formSubmissionLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// POST /api/v1/auth/register (Staff self-registration)
router.post('/register', formSubmissionLimiter, register);

// GET / POST /api/v1/auth/verify-email (Token verification link)
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me
router.get('/me', verifyAuth, getMe);

export default router;
