import Service from '../models/Service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

export const createService = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  
  let imageUrl = '';
  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.buffer, 'services', 'auto', {
      name: req.file.originalname,
      size: req.file.size,
      format: req.file.mimetype
    });
  }

  const service = new Service({
    title,
    description,
    tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
    image: imageUrl || req.body.image || '',
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    const { title, description, tags } = req.body;
    service.title = title || service.title;
    service.description = description || service.description;
    if (tags) {
      service.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    }
    
    if (req.file) {
      service.image = await uploadToCloudinary(req.file.buffer, 'services', 'auto', {
        name: req.file.originalname,
        size: req.file.size,
        format: req.file.mimetype
      });
    } else if (req.body.image) {
      service.image = req.body.image;
    }

    const updated = await service.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});
