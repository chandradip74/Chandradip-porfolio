import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(upload.single('coverImage'), createBlog);

router.route('/:id')
  .get(getBlog)
  .put(upload.single('coverImage'), updateBlog)
  .delete(deleteBlog);

export default router;
