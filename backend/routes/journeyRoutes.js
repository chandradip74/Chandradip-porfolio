import express from 'express';
import { getJourneys, createJourney, updateJourney, deleteJourney } from '../controllers/journeyController.js';

const router = express.Router();

router.route('/')
  .get(getJourneys)
  .post(createJourney);

router.route('/:id')
  .put(updateJourney)
  .delete(deleteJourney);

export default router;
