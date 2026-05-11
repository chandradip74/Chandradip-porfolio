import cloudinary from '../config/cloudinary.js';
import Resource from '../models/Resource.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

/**
 * Fetch all resources directly from Cloudinary storage (portfolio/ folder).
 * Lists both image and raw (PDF, etc.) resource types.
 */
export const getResources = asyncHandler(async (req, res) => {
  const results = [];

  // Fetch image resources from Cloudinary
  try {
    const imageRes = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'portfolio/',
      max_results: 500,
      resource_type: 'image',
    });
    results.push(...imageRes.resources.map(r => ({ ...r, resource_type: 'image' })));
  } catch (e) {
    console.error('Failed to fetch Cloudinary image resources:', e.message);
  }

  // Fetch raw resources (PDFs, docs, etc.) from Cloudinary
  try {
    const rawRes = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'portfolio/',
      max_results: 500,
      resource_type: 'raw',
    });
    results.push(...rawRes.resources.map(r => ({ ...r, resource_type: 'raw' })));
  } catch (e) {
    console.error('Failed to fetch Cloudinary raw resources:', e.message);
  }

  // Normalize to a consistent format for the admin panel
  const mapped = results.map(r => ({
    publicId: r.public_id,
    name: r.public_id.split('/').pop() || r.public_id,
    url: r.secure_url,
    resourceType: r.resource_type,
    format: r.format,
    size: r.bytes,
    createdAt: r.created_at,
  }));

  // Sort newest first
  mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(mapped);
});

/**
 * Upload a new file to Cloudinary and record it in MongoDB.
 */
export const createResource = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { originalname, size, mimetype } = req.file;

  let resourceType = 'auto';
  if (mimetype === 'application/pdf' || mimetype.includes('document')) {
    resourceType = 'raw';
  }

  // uploadToCloudinary saves to MongoDB Resource table as a side-effect
  const url = await uploadToCloudinary(req.file.buffer, 'resources', resourceType, {
    name: originalname,
    size,
    format: mimetype,
  });

  // Build publicId from the returned URL for consistent response
  const uploadIndex = url.indexOf('/upload/');
  let publicId = url.substring(uploadIndex + 8).replace(/^v\d+\//, '');
  if (resourceType !== 'raw') {
    publicId = publicId.replace(/\.[^/.]+$/, '');
  }

  res.status(201).json({
    publicId,
    name: originalname,
    url,
    resourceType: resourceType === 'raw' ? 'raw' : 'image',
    format: mimetype,
    size,
    createdAt: new Date().toISOString(),
  });
});

/**
 * Delete a file from Cloudinary storage by its public_id.
 * Also cleans up the MongoDB Resource record if present.
 * Route uses a wildcard so the publicId (which contains slashes) is preserved.
 */
export const deleteResource = asyncHandler(async (req, res) => {
  // Wildcard route: the full publicId is in req.params[0]
  const publicId = req.params[0];

  if (!publicId) {
    res.status(400);
    throw new Error('No resource public_id provided');
  }

  let deleted = false;

  // Try deleting as image
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    if (result.result === 'ok') deleted = true;
  } catch (e) {
    console.error('Image destroy attempt failed:', e.message);
  }

  // If not deleted as image, try as raw (PDF, doc, etc.)
  if (!deleted) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      if (result.result === 'ok') deleted = true;
    } catch (e) {
      console.error('Raw destroy attempt failed:', e.message);
    }
  }

  // Clean up MongoDB Resource table (best-effort, no error if missing)
  try {
    await Resource.deleteMany({ url: { $regex: publicId.split('/').pop() } });
  } catch (e) {
    console.error('MongoDB Resource cleanup error:', e.message);
  }

  // Clear the deleted image URL from any content documents that reference it
  // This prevents stale images appearing on the frontend after deletion
  const urlFragment = publicId.split('/').pop();
  const urlFilter = { $regex: urlFragment, $options: 'i' };

  try {
    await Service.updateMany(
      { image: urlFilter },
      { $set: { image: '' } }
    );
  } catch (e) {
    console.error('Service image cleanup error:', e.message);
  }

  try {
    await Project.updateMany(
      { image: urlFilter },
      { $set: { image: '' } }
    );
  } catch (e) {
    console.error('Project image cleanup error:', e.message);
  }

  try {
    await Achievement.updateMany(
      { $or: [{ certificateImage: urlFilter }, { imageUrl: urlFilter }, { iconPath: urlFilter }] },
      { $set: { certificateImage: '', imageUrl: '', iconPath: '' } }
    );
  } catch (e) {
    console.error('Achievement image cleanup error:', e.message);
  }

  if (deleted) {
    res.json({ message: 'File deleted from Cloudinary successfully' });
  } else {
    res.status(404);
    throw new Error('Resource not found in Cloudinary or already deleted');
  }
});
