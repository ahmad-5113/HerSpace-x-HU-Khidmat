import prisma from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// Helper to safely parse JSON body or return array
const parseBody = (body) => {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  try {
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [body];
  }
};

/**
 * List all published blogs
 */
export const listBlogs = async (req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { published_at: 'desc' }
    });

    const formatted = blogs.map((blog) => {
      const bodyArray = parseBody(blog.body);
      const snippet = bodyArray.length > 0 ? bodyArray[0] : '';

      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        cover_image: blog.cover_image,
        body: bodyArray,
        snippet,
        author_name: blog.author_name,
        published_at: blog.published_at,
        created_at: blog.created_at
      };
    });

    return ApiResponse.success(res, formatted, 'Published blogs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get single blog post by slug or ID
 */
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ slug }, { id: slug }]
      }
    });

    if (!blog) {
      throw ApiError.notFound('Blog article not found');
    }

    const bodyArray = parseBody(blog.body);

    const formatted = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      cover_image: blog.cover_image,
      body: bodyArray,
      author_name: blog.author_name,
      status: blog.status,
      published_at: blog.published_at,
      created_at: blog.created_at
    };

    return ApiResponse.success(res, formatted, 'Blog article retrieved successfully');
  } catch (error) {
    next(error);
  }
};
