import express from 'express';
import { getInterests, createInterest, updateInterest, deleteInterest } from '../controllers/interestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getInterests)
  .post(protect, createInterest);

router.route('/:id')
  .put(protect, updateInterest)
  .delete(protect, deleteInterest);

export default router;
