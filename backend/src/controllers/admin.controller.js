import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// ----------------------------------------------------
// VOLUNTEERS MANAGEMENT
// ----------------------------------------------------

export const getVolunteers = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { full_name: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } }
      ];
    }

    const volunteers = await prisma.volunteerApplication.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });

    return ApiResponse.success(res, volunteers, 'Volunteers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewer_notes } = req.body;

    const existing = await prisma.volunteerApplication.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Volunteer application not found');
    }

    const updated = await prisma.volunteerApplication.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(reviewer_notes !== undefined && { reviewer_notes })
      }
    });

    return ApiResponse.success(res, updated, 'Volunteer application updated successfully');
  } catch (error) {
    next(error);
  }
};

export const exportVolunteersCsv = async (req, res, next) => {
  try {
    const volunteers = await prisma.volunteerApplication.findMany({
      orderBy: { created_at: 'desc' }
    });

    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'City', 'Age', 'Gender', 'Status', 'Statement', 'Date'];
    const rows = volunteers.map((v) => [
      v.id,
      `"${(v.full_name || '').replace(/"/g, '""')}"`,
      `"${v.email}"`,
      `"${v.phone}"`,
      `"${(v.city || '').replace(/"/g, '""')}"`,
      v.age || '',
      v.gender || '',
      v.status,
      `"${(v.statement || '').replace(/"/g, '""')}"`,
      v.created_at.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="herspace_volunteers.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// INTERNSHIPS & CANDIDATE APPLICATIONS
// ----------------------------------------------------

export const createInternship = async (req, res, next) => {
  try {
    const { title, description, location, workplace_type, duration, deadline } = req.body;

    if (!title || !description || !location || !workplace_type || !duration || !deadline) {
      throw ApiError.badRequest('All internship fields are required.');
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const internship = await prisma.internship.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        location: location.trim(),
        workplace_type: workplace_type.trim(),
        duration: duration.trim(),
        deadline: new Date(deadline),
        is_active: true
      }
    });

    return ApiResponse.created(res, internship, 'Internship posting created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, location, workplace_type, duration, deadline, is_active } = req.body;

    const existing = await prisma.internship.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Internship not found');
    }

    const updated = await prisma.internship.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(location && { location: location.trim() }),
        ...(workplace_type && { workplace_type: workplace_type.trim() }),
        ...(duration && { duration: duration.trim() }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) })
      }
    });

    return ApiResponse.success(res, updated, 'Internship updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.internship.delete({ where: { id } });
    return ApiResponse.success(res, null, 'Internship deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const { internship_id, status } = req.query;

    const where = {};
    if (internship_id) where.internship_id = internship_id;
    if (status && status !== 'ALL') where.status = status;

    const applications = await prisma.internshipApplication.findMany({
      where,
      include: {
        internship: {
          select: { id: true, title: true, location: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return ApiResponse.success(res, applications, 'Candidate applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewer_notes } = req.body;

    const updated = await prisma.internshipApplication.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(reviewer_notes !== undefined && { reviewer_notes })
      }
    });

    return ApiResponse.success(res, updated, 'Candidate application updated successfully');
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// BLOGS CMS
// ----------------------------------------------------

export const createBlog = async (req, res, next) => {
  try {
    const { title, cover_image, body, author_name, status } = req.body;

    if (!title || !body) {
      throw ApiError.badRequest('Blog title and content body are required.');
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const stringBody = Array.isArray(body) ? JSON.stringify(body) : JSON.stringify([body]);

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        slug,
        cover_image: cover_image || '/assets/img_027.jpg',
        body: stringBody,
        author_name: author_name || 'HerSpace Team',
        status: status || 'PUBLISHED',
        published_at: new Date()
      }
    });

    return ApiResponse.created(res, blog, 'Blog post created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, cover_image, body, author_name, status } = req.body;

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Blog article not found');
    }

    let stringBody = undefined;
    if (body !== undefined) {
      stringBody = Array.isArray(body) ? JSON.stringify(body) : JSON.stringify([body]);
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(cover_image && { cover_image }),
        ...(stringBody && { body: stringBody }),
        ...(author_name && { author_name: author_name.trim() }),
        ...(status && { status })
      }
    });

    return ApiResponse.success(res, updated, 'Blog post updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.blog.delete({ where: { id } });
    return ApiResponse.success(res, null, 'Blog post deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// NEWSLETTER SUBSCRIBERS
// ----------------------------------------------------

export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribed_at: 'desc' }
    });

    return ApiResponse.success(
      res,
      {
        total: subscribers.length,
        subscribers
      },
      'Subscribers list retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const exportSubscribersCsv = async (req, res, next) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { is_active: true },
      orderBy: { subscribed_at: 'desc' }
    });

    const headers = ['Email', 'Source', 'Subscribed At'];
    const rows = subscribers.map((s) => [
      `"${s.email}"`,
      `"${s.source}"`,
      s.subscribed_at.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="herspace_subscribers.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// STAFF MANAGEMENT (SUPER_ADMIN ONLY)
// ----------------------------------------------------

export const getStaff = async (req, res, next) => {
  try {
    const staff = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    return ApiResponse.success(res, staff, 'Staff members retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      throw ApiError.badRequest('Name, email, password, and role are required.');
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (existing) {
      throw ApiError.conflict('A user with this email address already exists.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        role: role.trim(),
        is_email_verified: true,
        approval_status: 'APPROVED',
        is_active: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        approval_status: true,
        is_active: true,
        created_at: true
      }
    });

    return ApiResponse.created(res, newUser, 'Staff user created successfully');
  } catch (error) {
    next(error);
  }
};

export const toggleStaffStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (req.user.id === id) {
      throw ApiError.badRequest('You cannot deactivate your own administrative account.');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { is_active: Boolean(is_active) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        approval_status: true,
        is_active: true
      }
    });

    return ApiResponse.success(res, updated, 'Staff status updated successfully');
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// REGISTRATIONS & APPROVAL PIPELINE (SUPER_ADMIN ONLY)
// ----------------------------------------------------

export const getRegistrations = async (req, res, next) => {
  try {
    const registrations = await prisma.user.findMany({
      where: {
        role: { not: 'SUPER_ADMIN' }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        approval_status: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    return ApiResponse.success(res, registrations, 'Staff registrations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const approveRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw ApiError.notFound('User registration not found');
    }

    if (user.role === 'SUPER_ADMIN') {
      throw ApiError.badRequest('Super Admin accounts cannot be modified via approval pipeline.');
    }

    if (!user.is_email_verified) {
      throw ApiError.badRequest('Cannot approve registration. The user must verify their email first.');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        approval_status: 'APPROVED',
        is_active: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        approval_status: true,
        is_active: true
      }
    });

    return ApiResponse.success(res, updated, `Registration for ${updated.name} has been approved. The user can now log in.`);
  } catch (error) {
    next(error);
  }
};

export const rejectRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw ApiError.notFound('User registration not found');
    }

    if (user.role === 'SUPER_ADMIN') {
      throw ApiError.badRequest('Super Admin accounts cannot be deleted via approval pipeline.');
    }

    // Delete the registration upon disapproval
    await prisma.user.delete({ where: { id } });

    return ApiResponse.success(res, null, `Registration for ${user.name} has been disapproved and deleted.`);
  } catch (error) {
    next(error);
  }
};

