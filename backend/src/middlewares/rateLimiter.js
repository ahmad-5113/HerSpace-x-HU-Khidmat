import rateLimit from 'express-rate-limit';

// Standard general API limiter: 200 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Strict limiter for sensitive public form submissions (volunteers, newsletter, donate)
export const formSubmissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many submissions from this IP. Please wait a few minutes before trying again.'
  }
});
