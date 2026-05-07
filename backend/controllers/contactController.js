import Contact from '../models/Contact.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, description } = req.body;
  const contact = new Contact({ firstName, lastName, email, description });
  const createdContact = await contact.save();
  res.status(201).json(createdContact);
});

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});
