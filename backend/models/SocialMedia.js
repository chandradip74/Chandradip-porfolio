import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('SocialMedia', socialMediaSchema);
