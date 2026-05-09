import SocialMedia from '../models/SocialMedia.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getSocialMedia = asyncHandler(async (req, res) => {
  const items = await SocialMedia.find({}).sort({ order: 1 });
  res.json(items);
});

export const createSocialMedia = asyncHandler(async (req, res) => {
  const { platform, image, icon, colorClass, link, order } = req.body;
  const item = new SocialMedia({ platform, image: image || '', icon: icon || '', colorClass: colorClass || '#6366f1', link, order: order || 0 });
  const created = await item.save();
  res.status(201).json(created);
});

export const updateSocialMedia = asyncHandler(async (req, res) => {
  const item = await SocialMedia.findById(req.params.id);
  if (item) {
    const { platform, image, icon, colorClass, link, order } = req.body;
    item.platform = platform || item.platform;
    item.image = image !== undefined ? image : item.image;
    item.icon = icon !== undefined ? icon : item.icon;
    item.colorClass = colorClass !== undefined ? colorClass : item.colorClass;
    item.link = link || item.link;
    item.order = order !== undefined ? order : item.order;
    const updated = await item.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Social media not found');
  }
});

export const deleteSocialMedia = asyncHandler(async (req, res) => {
  const item = await SocialMedia.findById(req.params.id);
  if (item) {
    await item.deleteOne();
    res.json({ message: 'Social media removed' });
  } else {
    res.status(404);
    throw new Error('Social media not found');
  }
});
