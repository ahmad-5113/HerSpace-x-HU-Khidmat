import { z } from 'zod';

// Email newsletter subscriber schema
export const subscribeSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  source: z.enum(['BANNER', 'FOOTER']).default('FOOTER').optional()
});

// Volunteer application schema
export const volunteerApplicationSchema = z.object({
  full_name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name cannot exceed 150 characters'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(30, 'Phone number cannot exceed 30 characters'),
  city: z.string().trim().max(100).optional().nullable(),
  age: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z.number().int().min(10, 'Age must be at least 10').max(100, 'Invalid age').optional()
    )
    .nullable(),
  gender: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (val) => !val || ['Male', 'Female', 'Other'].includes(val),
      { message: 'Gender must be Male, Female, or Other' }
    ),
  statement: z
    .string({ required_error: 'Statement is required' })
    .trim()
    .min(10, 'Please write at least 10 characters explaining why you want to volunteer')
    .max(3000, 'Statement cannot exceed 3000 characters')
});
