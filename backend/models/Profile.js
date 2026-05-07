import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: [{ type: String }],
  description: { type: String, required: true },
  aboutMe: { type: String },
  profileImage: { type: String },
  cvFile: { type: String },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
