import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Technology from '../models/Technology.js';
import Achievement from '../models/Achievement.js';
import Contact from '../models/Contact.js';
import Journey from '../models/Journey.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [projects, services, technologies, achievements, messages, journeys] = await Promise.all([
    Project.countDocuments(),
    Service.countDocuments(),
    Technology.countDocuments(),
    Achievement.countDocuments(),
    Contact.countDocuments(),
    Journey.countDocuments(),
  ]);

  res.json({
    projects,
    services,
    technologies,
    achievements,
    messages,
    journeys,
  });
});
