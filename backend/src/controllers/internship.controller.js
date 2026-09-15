import prisma from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// Helper to determine CSS tag classes matching frontend styles
const getTagClass = (workplaceType) => {
  const type = (workplaceType || '').toLowerCase();
  if (type.includes('remote')) return 'tag-remote';
  if (type.includes('site') || type.includes('onsite')) return 'tag-onsite';
  if (type.includes('hybrid')) return 'tag-hybrid';
  return 'tag-remote';
};

// Helper to format deadline date cleanly
const formatDeadline = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `Deadline: ${day} ${month} ${year}`;
};

/**
 * List all active internships
 */
export const listInternships = async (req, res, next) => {
  try {
    const internships = await prisma.internship.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });

    const formatted = internships.map((job) => ({
      id: job.id,
      title: job.title,
      slug: job.slug,
      desc: job.description,
      location: job.location,
      duration: job.duration,
      workplaceType: job.workplace_type,
      tagClass: getTagClass(job.workplace_type),
      tagLabel: job.workplace_type,
      deadlineRaw: job.deadline,
      deadline: formatDeadline(job.deadline)
    }));

    return ApiResponse.success(res, formatted, 'Active internships retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get details of a single internship
 */
export const getInternshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await prisma.internship.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    if (!internship) {
      throw ApiError.notFound('Internship not found');
    }

    const formatted = {
      id: internship.id,
      title: internship.title,
      slug: internship.slug,
      desc: internship.description,
      location: internship.location,
      duration: internship.duration,
      workplaceType: internship.workplace_type,
      tagClass: getTagClass(internship.workplace_type),
      tagLabel: internship.workplace_type,
      deadlineRaw: internship.deadline,
      deadline: formatDeadline(internship.deadline)
    };

    return ApiResponse.success(res, formatted, 'Internship details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Submit internship application with CV file upload
 */
export const applyInternship = async (req, res, next) => {
  try {
    const {
      internship_id,
      role_title,
      full_name,
      email,
      phone,
      city,
      age,
      gender,
      statement
    } = req.body;

    // Validate CV upload
    if (!req.file) {
      throw ApiError.badRequest('CV file is required. Please upload a PDF, DOC, or DOCX document (max 5MB).');
    }

    // Validate text fields
    if (!full_name || full_name.trim().length < 2) {
      throw ApiError.badRequest('Full name is required and must be at least 2 characters.');
    }
    if (!email || !email.includes('@')) {
      throw ApiError.badRequest('A valid email address is required.');
    }
    if (!phone || phone.trim().length < 7) {
      throw ApiError.badRequest('A valid phone number is required.');
    }
    if (!statement || statement.trim().length < 10) {
      throw ApiError.badRequest('Please provide a statement of at least 10 characters explaining why you want to join.');
    }

    const cvUrl = `/uploads/cvs/${req.file.filename}`;

    const application = await prisma.internshipApplication.create({
      data: {
        internship_id: internship_id || null,
        role_title: (role_title || 'General Internship').trim(),
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        city: city ? city.trim() : null,
        age: age ? parseInt(age, 10) : null,
        gender: gender && gender !== 'Select' ? gender.trim() : null,
        statement: statement.trim(),
        cv_url: cvUrl,
        status: 'APPLIED'
      }
    });

    return ApiResponse.created(
      res,
      {
        id: application.id,
        role_title: application.role_title,
        full_name: application.full_name,
        email: application.email,
        cv_url: application.cv_url,
        status: application.status,
        created_at: application.created_at
      },
      'Thank you! Your internship application has been submitted successfully.'
    );
  } catch (error) {
    next(error);
  }
};
