import Journey from '../models/Journey.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getJourneys = asyncHandler(async (req, res) => {
  const journeys = await Journey.find({}).sort({ year: 1 });
  res.json(journeys);
});

export const createJourney = asyncHandler(async (req, res) => {
  const { year, title, label, labelColor, description } = req.body;

  const journey = new Journey({
    year,
    title,
    label,
    labelColor,
    description,
  });

  const createdJourney = await journey.save();
  res.status(201).json(createdJourney);
});

export const updateJourney = asyncHandler(async (req, res) => {
  const journey = await Journey.findById(req.params.id);
  if (journey) {
    const { year, title, label, labelColor, description } = req.body;
    journey.year = year || journey.year;
    journey.title = title || journey.title;
    journey.label = label !== undefined ? label : journey.label;
    journey.labelColor = labelColor !== undefined ? labelColor : journey.labelColor;
    journey.description = description || journey.description;
    const updated = await journey.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Journey not found');
  }
});

export const deleteJourney = asyncHandler(async (req, res) => {
  const journey = await Journey.findById(req.params.id);

  if (journey) {
    await journey.deleteOne();
    res.json({ message: 'Journey removed' });
  } else {
    res.status(404);
    throw new Error('Journey not found');
  }
});
