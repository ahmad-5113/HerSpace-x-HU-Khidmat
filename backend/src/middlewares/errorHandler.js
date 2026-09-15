import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    error = ApiError.badRequest('Validation error', formattedErrors);
  } else if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack })
  };

  return res.status(error.statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};
