import Settings from '../models/Settings.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get site settings (public - used by frontend to check maintenance mode)
// @route   GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json(settings);
});

// @desc    Update site settings (admin only)
// @route   PUT /api/settings
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  const { maintenanceMode, maintenanceMessage } = req.body;

  if (maintenanceMode !== undefined) {
    settings.maintenanceMode = maintenanceMode;
  }
  if (maintenanceMessage !== undefined) {
    settings.maintenanceMessage = maintenanceMessage;
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});
