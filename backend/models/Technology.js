import mongoose from 'mongoose';

const technologySchema = new mongoose.Schema({
  technologyName: { type: String, required: true },
  iconPath: { type: String },
  colorClass: { type: String, default: 'text-primary' },
}, { timestamps: true });

export default mongoose.model('Technology', technologySchema);
