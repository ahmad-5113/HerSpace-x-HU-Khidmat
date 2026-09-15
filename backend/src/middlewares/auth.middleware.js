import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import prisma from '../config/db.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication required. Please provide a valid Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication token missing.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Your session has expired. Please log in again.');
      }
      throw ApiError.unauthorized('Invalid authentication token.');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true
      }
    });

    if (!user) {
      throw ApiError.unauthorized('User account no longer exists.');
    }

    if (!user.is_active) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact an administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    // SUPER_ADMIN has access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Access forbidden. This action requires one of: ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
};
