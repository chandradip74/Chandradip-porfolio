import mongoose from 'mongoose';

const processSchema = new mongoose.Schema({
  step: { type: String, required: true },       // e.g. "01"
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Process', processSchema);
