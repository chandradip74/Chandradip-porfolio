import Blog from '../models/Blog.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

// Helper: generate a URL-safe slug from a title
const generateSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/blogs  — public (only published unless ?all=1 sent by admin)
export const getBlogs = asyncHandler(async (req, res) => {
  const filter = req.query.all === '1' ? {} : { published: true };
  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json(blogs);
});

// GET /api/blogs/:id  — single post by id or slug
export const getBlog = asyncHandler(async (req, res) => {
  const blog =
    (await Blog.findById(req.params.id).catch(() => null)) ||
    (await Blog.findOne({ slug: req.params.id }));
  if (!blog) { res.status(404); throw new Error('Blog post not found'); }
  res.json(blog);
});

// POST /api/blogs
export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, tags, readTime, published } = req.body;

  let coverImage = '';
  if (req.file) {
    coverImage = await uploadToCloudinary(req.file.buffer, 'blogs', 'auto', {
      name: req.file.originalname,
      size: req.file.size,
      format: req.file.mimetype,
    });
  }

  const slug = generateSlug(title);

  const blog = new Blog({
    title,
    slug,
    excerpt,
    content,
    coverImage: coverImage || req.body.coverImage,
    category:  category  || 'General',
    tags:      tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
    readTime:  readTime  ? Number(readTime) : 5,
    published: published === 'true' || published === true,
  });

  const created = await blog.save();
  res.status(201).json(created);
});

// PUT /api/blogs/:id
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) { res.status(404); throw new Error('Blog post not found'); }

  const { title, excerpt, content, category, tags, readTime, published } = req.body;

  if (title) { blog.title = title; blog.slug = generateSlug(title); }
  if (excerpt  !== undefined) blog.excerpt  = excerpt;
  if (content  !== undefined) blog.content  = content;
  if (category !== undefined) blog.category = category;
  if (tags     !== undefined) blog.tags     = Array.isArray(tags) ? tags : JSON.parse(tags);
  if (readTime !== undefined) blog.readTime = Number(readTime);
  if (published !== undefined) blog.published = published === 'true' || published === true;

  if (req.file) {
    blog.coverImage = await uploadToCloudinary(req.file.buffer, 'blogs', 'auto', {
      name: req.file.originalname,
      size: req.file.size,
      format: req.file.mimetype,
    });
  } else if (req.body.coverImage !== undefined) {
    blog.coverImage = req.body.coverImage;
  }

  const updated = await blog.save();
  res.json(updated);
});

// DELETE /api/blogs/:id
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) { res.status(404); throw new Error('Blog post not found'); }
  await blog.deleteOne();
  res.json({ message: 'Blog post deleted' });
});
