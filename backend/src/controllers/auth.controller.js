import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { env } from '../config/env.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { sendVerificationEmail } from '../services/email.service.js';

/**
 * Self-registration for non-superadmin staff (HR_MANAGER or CONTENT_EDITOR)
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      throw ApiError.badRequest('Name, email, password, and requested role are required.');
    }

    // Disallow self-registration as SUPER_ADMIN
    const requestedRole = role.trim();
    if (!['HR_MANAGER', 'CONTENT_EDITOR'].includes(requestedRole)) {
      throw ApiError.badRequest(
        'Self-registration is only available for HR_MANAGER or CONTENT_EDITOR roles.'
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash,
        role: requestedRole,
        is_email_verified: false,
        approval_status: 'PENDING',
        is_active: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        approval_status: true,
        created_at: true,
      },
    });

    // Generate Email Verification JWT (24h validity)
    const verificationToken = jwt.sign(
      { id: newUser.id, email: newUser.email, purpose: 'EMAIL_VERIFICATION' },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const emailResult = await sendVerificationEmail(newUser.email, newUser.name, verificationToken);

    return ApiResponse.created(
      res,
      {
        user: newUser,
        verificationUrl: emailResult.verificationUrl,
      },
      'Registration submitted! Please verify your email address to proceed to Super Admin review.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email via token
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token;

    if (!token) {
      throw ApiError.badRequest('Verification token is missing.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw ApiError.badRequest('Your verification link has expired. Please contact support or register again.');
      }
      throw ApiError.badRequest('Invalid verification token.');
    }

    if (decoded.purpose !== 'EMAIL_VERIFICATION') {
      throw ApiError.badRequest('Invalid token purpose.');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw ApiError.notFound('User account not found.');
    }

    if (!user.is_email_verified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { is_email_verified: true },
      });
    }

    // Check if the request accepts HTML (direct click from email in browser)
    const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

    if (acceptsHtml) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Email Verified — HerSpace</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #FAF8FD; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .card { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(66,0,113,0.08); max-width: 480px; text-align: center; }
            h2 { color: #420071; margin-bottom: 12px; }
            p { color: #555; line-height: 1.6; margin-bottom: 24px; font-size: 15px; }
            .btn { background: #6F57A4; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="card">
            <div style="font-size: 48px; margin-bottom: 16px;">✉️✨</div>
            <h2>Email Successfully Verified!</h2>
            <p>Thank you, <strong>${user.name}</strong>. Your email has been verified.<br/><br/>Your account is now queued for review by the <strong>Super Admin</strong>. Once approved, you will be able to log in to the staff portal.</p>
            <a href="${env.CORS_ORIGIN || 'http://localhost:5173'}" class="btn">Return to HerSpace</a>
          </div>
        </body>
        </html>
      `);
    }

    return ApiResponse.success(
      res,
      { email: user.email, is_email_verified: true, approval_status: user.approval_status },
      'Email successfully verified! Your account is now pending Super Admin approval.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate staff user
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required.');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    // Check email verification status
    if (!user.is_email_verified) {
      throw ApiError.forbidden(
        'Please verify your email address before logging in. Check your inbox for the verification link.'
      );
    }

    // Check approval status
    if (user.approval_status === 'PENDING') {
      throw ApiError.forbidden(
        'Your email has been verified! However, your account is awaiting review and approval by the Super Admin.'
      );
    }

    if (user.approval_status === 'REJECTED' || !user.is_active) {
      throw ApiError.forbidden(
        'Your account is currently inactive or was disapproved by the administrator.'
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return ApiResponse.success(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(res, req.user, 'Current user profile');
  } catch (error) {
    next(error);
  }
};
