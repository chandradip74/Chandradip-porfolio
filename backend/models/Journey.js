import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  label: { type: String },
  labelColor: { type: String },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Journey', journeySchema);
