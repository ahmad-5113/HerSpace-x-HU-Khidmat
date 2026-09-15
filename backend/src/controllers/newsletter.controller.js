import prisma from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, source } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      if (existing.is_active) {
        return ApiResponse.success(
          res,
          { email: existing.email, is_active: true },
          'You are already subscribed to the HerSpace newsletter!',
          200
        );
      }

      // Reactivate subscription
      const reactivated = await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: {
          is_active: true,
          source: source || existing.source,
          subscribed_at: new Date()
        }
      });

      return ApiResponse.success(
        res,
        { email: reactivated.email, is_active: true },
        'Welcome back! Your subscription to HerSpace newsletter has been reactivated.',
        200
      );
    }

    // Create new subscriber
    const newSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        source: source || 'FOOTER',
        is_active: true
      }
    });

    return ApiResponse.created(
      res,
      { email: newSubscriber.email, is_active: true },
      'Thank you for subscribing to HerSpace newsletter!'
    );
  } catch (error) {
    next(error);
  }
};
