import express from 'express';
import { getSocialMedia, createSocialMedia, updateSocialMedia, deleteSocialMedia } from '../controllers/socialMediaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSocialMedia)
  .post(protect, createSocialMedia);

router.route('/:id')
  .put(protect, updateSocialMedia)
  .delete(protect, deleteSocialMedia);

export default router;
