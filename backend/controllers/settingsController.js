import asyncHandler from 'express-async-handler';
import Settings from '../models/Settings.js';

// @desc    Get settings (Public)
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    // If no settings exist yet, create defaults
    settings = await Settings.create({
      maintenanceMode: false,
      maintenanceMessage: "We're performing scheduled maintenance. We'll be back shortly!",
    });
  }

  res.json(settings);
});

// @desc    Update settings (Admin only)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  const { maintenanceMode, maintenanceMessage } = req.body;

  let settings = await Settings.findOne();

  if (!settings) {
    settings = new Settings({
      maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : false,
      maintenanceMessage: maintenanceMessage || '',
    });
  } else {
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});
