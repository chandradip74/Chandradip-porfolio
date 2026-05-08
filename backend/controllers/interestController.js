import Interest from '../models/Interest.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getInterests = asyncHandler(async (req, res) => {
  const interests = await Interest.find({});
  res.json(interests);
});

export const createInterest = asyncHandler(async (req, res) => {
  const { title, icon, color, bg } = req.body;

  const interest = new Interest({
    title,
    icon,
    color,
    bg
  });

  const createdInterest = await interest.save();
  res.status(201).json(createdInterest);
});

export const updateInterest = asyncHandler(async (req, res) => {
  const interest = await Interest.findById(req.params.id);

  if (interest) {
    const { title, icon, color, bg } = req.body;
    interest.title = title || interest.title;
    interest.icon = icon !== undefined ? icon : interest.icon;
    interest.color = color || interest.color;
    interest.bg = bg || interest.bg;
    
    const updated = await interest.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Interest not found');
  }
});

export const deleteInterest = asyncHandler(async (req, res) => {
  const interest = await Interest.findById(req.params.id);

  if (interest) {
    await interest.deleteOne();
    res.json({ message: 'Interest removed' });
  } else {
    res.status(404);
    throw new Error('Interest not found');
  }
});
