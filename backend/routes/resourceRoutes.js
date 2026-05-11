import express from 'express';
import { getResources, createResource, deleteResource } from '../controllers/resourceController.js';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getResources)
  .post(protect, upload.single('file'), createResource);

// Wildcard route to capture public_ids containing slashes (e.g., portfolio/profile/abc)
router.delete(/^\/(.+)$/, protect, deleteResource);

export default router;
