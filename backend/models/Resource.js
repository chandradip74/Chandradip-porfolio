import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  resourceType: { type: String, required: true }, // 'auto' or 'raw'
  format: { type: String },
  size: { type: Number },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
