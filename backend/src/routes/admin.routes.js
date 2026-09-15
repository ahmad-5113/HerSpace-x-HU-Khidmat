import { Router } from 'express';
import { verifyAuth, requireRoles } from '../middlewares/auth.middleware.js';
import {
  // Volunteers
  getVolunteers,
  updateVolunteer,
  exportVolunteersCsv,
  // Internships & Applications
  createInternship,
  updateInternship,
  deleteInternship,
  getApplications,
  updateApplication,
  // Blogs
  createBlog,
  updateBlog,
  deleteBlog,
  // Newsletter
  getSubscribers,
  exportSubscribersCsv,
  // Staff
  getStaff,
  createStaff,
  toggleStaffStatus,
  // Registrations & Approvals
  getRegistrations,
  approveRegistration,
  rejectRegistration
} from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require valid authentication
router.use(verifyAuth);

// ----------------------------------------------------
// Volunteers (HR_MANAGER, SUPER_ADMIN)
// ----------------------------------------------------
router.get('/volunteers', requireRoles('HR_MANAGER'), getVolunteers);
router.get('/volunteers/export', requireRoles('HR_MANAGER'), exportVolunteersCsv);
router.patch('/volunteers/:id', requireRoles('HR_MANAGER'), updateVolunteer);

// ----------------------------------------------------
// Internships & Applications (HR_MANAGER, SUPER_ADMIN)
// ----------------------------------------------------
router.post('/internships', requireRoles('HR_MANAGER'), createInternship);
router.put('/internships/:id', requireRoles('HR_MANAGER'), updateInternship);
router.delete('/internships/:id', requireRoles('HR_MANAGER'), deleteInternship);
router.get('/applications', requireRoles('HR_MANAGER'), getApplications);
router.patch('/applications/:id', requireRoles('HR_MANAGER'), updateApplication);

// ----------------------------------------------------
// Blogs CMS (CONTENT_EDITOR, SUPER_ADMIN)
// ----------------------------------------------------
router.post('/blogs', requireRoles('CONTENT_EDITOR'), createBlog);
router.put('/blogs/:id', requireRoles('CONTENT_EDITOR'), updateBlog);
router.delete('/blogs/:id', requireRoles('CONTENT_EDITOR'), deleteBlog);

// ----------------------------------------------------
// Newsletter (All Authenticated Admins)
// ----------------------------------------------------
router.get('/subscribers', getSubscribers);
router.get('/subscribers/export', exportSubscribersCsv);

// ----------------------------------------------------
// Staff Management (SUPER_ADMIN Only)
// ----------------------------------------------------
router.get('/staff', requireRoles('SUPER_ADMIN'), getStaff);
router.post('/staff', requireRoles('SUPER_ADMIN'), createStaff);
router.patch('/staff/:id/status', requireRoles('SUPER_ADMIN'), toggleStaffStatus);

// ----------------------------------------------------
// Staff Approvals & Registrations (SUPER_ADMIN Only)
// ----------------------------------------------------
router.get('/registrations', requireRoles('SUPER_ADMIN'), getRegistrations);
router.patch('/registrations/:id/approve', requireRoles('SUPER_ADMIN'), approveRegistration);
router.delete('/registrations/:id', requireRoles('SUPER_ADMIN'), rejectRegistration);

export default router;

