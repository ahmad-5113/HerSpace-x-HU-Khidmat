import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Setup optional SMTP transport
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send email verification link with JWT
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;

  console.log('\n=============================================================');
  console.log(`📧 [HERSPACE STAFF VERIFICATION EMAIL]`);
  console.log(`To: ${name} <${email}>`);
  console.log(`Click this link to verify your email address:`);
  console.log(`🔗 ${verificationUrl}`);
  console.log('=============================================================\n');

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"HerSpace Leadership" <no-reply@herspace.org>',
        to: email,
        subject: 'Verify your HerSpace Staff Account',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #420071;">Welcome to HerSpace, ${name}!</h2>
            <p>You recently registered for a staff account on HerSpace. Please verify your email address by clicking the button below:</p>
            <div style="margin: 25px 0;">
              <a href="${verificationUrl}" style="background-color: #6F57A4; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify My Email Address</a>
            </div>
            <p style="font-size: 13px; color: #777;">Once verified, your account will be reviewed and approved by a Super Admin before you can sign in.</p>
            <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.warn('⚠️ SMTP send error (proceeding in dev mode):', err.message);
    }
  }

  return { verificationUrl, token };
};
