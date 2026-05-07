import Technology from '../models/Technology.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getTechnologies = asyncHandler(async (req, res) => {
  const technologies = await Technology.find({});
  res.json(technologies);
});

export const createTechnology = asyncHandler(async (req, res) => {
  const { technologyName, iconPath } = req.body;

  const technology = new Technology({
    technologyName,
    iconPath,
  });

  const createdTechnology = await technology.save();
  res.status(201).json(createdTechnology);
});

export const deleteTechnology = asyncHandler(async (req, res) => {
  const technology = await Technology.findById(req.params.id);

  if (technology) {
    await technology.deleteOne();
    res.json({ message: 'Technology removed' });
  } else {
    res.status(404);
    throw new Error('Technology not found');
  }
});
