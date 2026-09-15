import prisma from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const submitVolunteerApplication = async (req, res, next) => {
  try {
    const { full_name, email, phone, city, age, gender, statement } = req.body;

    const application = await prisma.volunteerApplication.create({
      data: {
        full_name,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        city: city ? city.trim() : null,
        age: age ? parseInt(age, 10) : null,
        gender: gender && gender !== 'Select' ? gender.trim() : null,
        statement: statement.trim(),
        status: 'PENDING'
      }
    });

    return ApiResponse.created(
      res,
      {
        id: application.id,
        full_name: application.full_name,
        email: application.email,
        status: application.status,
        created_at: application.created_at
      },
      'Thank you! Your volunteer application has been submitted successfully.'
    );
  } catch (error) {
    next(error);
  }
};
