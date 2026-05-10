import express from 'express';
import { authUser, getUserProfile, updateUserProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

export default router;
