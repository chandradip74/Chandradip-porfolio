import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(upload.single('icon'), createService);

router.route('/:id')
  .put(upload.single('icon'), updateService)
  .delete(deleteService);

export default router;
