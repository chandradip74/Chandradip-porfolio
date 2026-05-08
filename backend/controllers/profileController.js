import Profile from '../models/Profile.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

// @desc    Get profile
// @route   GET /api/profile
export const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({
      name: 'Your Name',
      role: 'Your Role',
      description: 'Your Description'
    });
  }
  res.json(profile);
});

// @desc    Update profile
// @route   PUT /api/profile
export const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = new Profile();
  }

  const { name, role, description, aboutMe, email, phone, location } = req.body;
  
  profile.name = name || profile.name;
  if (role) {
    profile.role = Array.isArray(role) ? role : JSON.parse(role);
  }
  profile.description = description || profile.description;
  if (aboutMe !== undefined) profile.aboutMe = aboutMe;
  if (email !== undefined) profile.email = email;
  if (phone !== undefined) profile.phone = phone;
  if (location !== undefined) profile.location = location;

  if (req.files) {
    if (req.files.profileImage) {
      profile.profileImage = await uploadToCloudinary(req.files.profileImage[0].buffer, 'profile');
    }
    if (req.files.cvFile) {
      profile.cvFile = await uploadToCloudinary(req.files.cvFile[0].buffer, 'profile', 'raw');
    }
  }

  const updatedProfile = await profile.save();
  res.json(updatedProfile);
});
