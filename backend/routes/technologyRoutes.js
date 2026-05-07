import express from 'express';
import { getTechnologies, createTechnology, deleteTechnology } from '../controllers/technologyController.js';

const router = express.Router();

router.route('/')
  .get(getTechnologies)
  .post(createTechnology);

router.route('/:id')
  .delete(deleteTechnology);

export default router;
