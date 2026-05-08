import Resource from '../models/Resource.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({}).sort({ createdAt: -1 });
  res.json(resources);
});

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

  // uploadToCloudinary will now handle saving the Resource record when metadata is provided
  const url = await uploadToCloudinary(req.file.buffer, 'resources', resourceType, {
    name: originalname,
    size: size,
    format: mimetype
  });
  
  // Find the newly created resource to return it
  const createdResource = await Resource.findOne({ url });
  res.status(201).json(createdResource);
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (resource) {
    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
