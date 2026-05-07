import Achievement from '../models/Achievement.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({});
  res.json(achievements);
});

export const createAchievement = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, certificateTag, companyName, iconPath } = req.body;
  
  let certificateImageUrl = '';
  if (req.file) {
    certificateImageUrl = await uploadToCloudinary(req.file.buffer, 'achievements');
  }

  const achievement = new Achievement({
    title,
    description,
    certificateImage: certificateImageUrl || req.body.certificateImage,
    imageUrl: imageUrl || '',
    certificateTag: certificateTag || '',
    companyName: companyName || '',
    iconPath: iconPath || '',
  });

  const createdAchievement = await achievement.save();
  res.status(201).json(createdAchievement);
});

export const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (achievement) {
    const { title, description, imageUrl, certificateTag, companyName, iconPath } = req.body;
    achievement.title = title || achievement.title;
    achievement.description = description || achievement.description;
    achievement.imageUrl = imageUrl !== undefined ? imageUrl : achievement.imageUrl;
    achievement.certificateTag = certificateTag !== undefined ? certificateTag : achievement.certificateTag;
    achievement.companyName = companyName !== undefined ? companyName : achievement.companyName;
    achievement.iconPath = iconPath !== undefined ? iconPath : achievement.iconPath;
    if (req.file) {
      achievement.certificateImage = await uploadToCloudinary(req.file.buffer, 'achievements');
    }
    const updated = await achievement.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});

export const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);

  if (achievement) {
    await achievement.deleteOne();
    res.json({ message: 'Achievement removed' });
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});
