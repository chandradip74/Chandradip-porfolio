import express from 'express';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(upload.fields([{ name: 'certificateImage', maxCount: 1 }, { name: 'iconPath', maxCount: 1 }]), createAchievement);

router.route('/:id')
  .put(upload.fields([{ name: 'certificateImage', maxCount: 1 }, { name: 'iconPath', maxCount: 1 }]), updateAchievement)
  .delete(deleteAchievement);

export default router;
