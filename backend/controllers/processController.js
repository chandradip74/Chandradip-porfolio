import Process from '../models/Process.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getProcesses = asyncHandler(async (req, res) => {
  const processes = await Process.find({}).sort({ order: 1 });
  res.json(processes);
});

export const createProcess = asyncHandler(async (req, res) => {
  const { step, title, description, order } = req.body;
  const process = new Process({ step, title, description, order: order || 0 });
  const created = await process.save();
  res.status(201).json(created);
});

export const updateProcess = asyncHandler(async (req, res) => {
  const process = await Process.findById(req.params.id);
  if (process) {
    const { step, title, description, order } = req.body;
    process.step = step || process.step;
    process.title = title || process.title;
    process.description = description || process.description;
    process.order = order !== undefined ? order : process.order;
    const updated = await process.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Process not found');
  }
});

export const deleteProcess = asyncHandler(async (req, res) => {
  const process = await Process.findById(req.params.id);
  if (process) {
    await process.deleteOne();
    res.json({ message: 'Process removed' });
  } else {
    res.status(404);
    throw new Error('Process not found');
  }
});
