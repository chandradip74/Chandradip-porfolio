import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String }, // Can be URL, HTML, or React Icon Name
  color: { type: String, default: 'text-primary' },
  bg: { type: String, default: 'bg-primary/10' },
}, { timestamps: true });

export default mongoose.model('Interest', interestSchema);
