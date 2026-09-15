import { Router } from 'express';
import { listBlogs, getBlogBySlug } from '../controllers/blog.controller.js';

const router = Router();

// GET /api/v1/blogs
router.get('/', listBlogs);

// GET /api/v1/blogs/:slug
router.get('/:slug', getBlogBySlug);

export default router;
