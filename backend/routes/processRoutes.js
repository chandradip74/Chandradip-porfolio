import express from 'express';
import { getProcesses, createProcess, updateProcess, deleteProcess } from '../controllers/processController.js';

const router = express.Router();

router.route('/')
  .get(getProcesses)
  .post(createProcess);

router.route('/:id')
  .put(updateProcess)
  .delete(deleteProcess);

export default router;
