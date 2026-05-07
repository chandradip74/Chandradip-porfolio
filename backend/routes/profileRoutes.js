import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProfile)
  .put(upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'cvFile', maxCount: 1 }]), updateProfile);

export default router;
