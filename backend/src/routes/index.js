import { Router } from 'express';
import healthRoutes from './health.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import volunteerRoutes from './volunteer.routes.js';
import internshipRoutes from './internship.routes.js';
import blogRoutes from './blog.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Mount Routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/internships', internshipRoutes);
router.use('/blogs', blogRoutes);

export default router;
