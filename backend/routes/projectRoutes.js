import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(upload.single('image'), createProject);

router.route('/:id')
  .put(upload.single('image'), updateProject)
  .delete(deleteProject);

export default router;
