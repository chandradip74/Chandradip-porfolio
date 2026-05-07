import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  certificateImage: { type: String },
  imageUrl: { type: String },
  certificateTag: { type: String },
  companyName: { type: String },
  iconPath: { type: String },
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
