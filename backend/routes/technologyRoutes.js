import express from 'express';
import { getTechnologies, createTechnology, updateTechnology, deleteTechnology } from '../controllers/technologyController.js';

const router = express.Router();

router.route('/')
  .get(getTechnologies)
  .post(createTechnology);

router.route('/:id')
  .put(updateTechnology)
  .delete(deleteTechnology);

export default router;
