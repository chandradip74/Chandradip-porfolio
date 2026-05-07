import express from 'express';
import { createContact, getContacts, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

router.route('/')
  .post(createContact)
  .get(getContacts);

router.route('/:id')
  .delete(deleteContact);

export default router;
