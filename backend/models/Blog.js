import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt:     { type: String, required: true },
  content:     { type: String, required: true },
  coverImage:  { type: String },
  category:    { type: String, default: 'General' },
  tags:        [{ type: String }],
  readTime:    { type: Number, default: 5 },   // minutes
  published:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
