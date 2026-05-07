import Service from '../models/Service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

export const createService = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  
  let iconUrl = '';
  if (req.file) {
    iconUrl = await uploadToCloudinary(req.file.buffer, 'services');
  }

  const service = new Service({
    title,
    description,
    icon: iconUrl || req.body.icon,
    tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
});

export const updateService = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const service = await Service.findById(req.params.id);

  if (service) {
    service.title = title || service.title;
    service.description = description || service.description;
    if (tags) {
      service.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    }

    if (req.file) {
      service.icon = await uploadToCloudinary(req.file.buffer, 'services');
    } else if (req.body.icon) {
      service.icon = req.body.icon;
    }

    const updatedService = await service.save();
    res.json(updatedService);
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
