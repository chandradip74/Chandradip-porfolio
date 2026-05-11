/**
 * One-time cleanup script: clears stale Cloudinary image URLs
 * from Service documents whose images no longer exist in Cloudinary.
 *
 * Usage: node scripts/clear-stale-service-images.js
 */

import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import 'dotenv/config';

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  tags: [String],
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const services = await Service.find({ image: { $ne: '' } });
  console.log(`Found ${services.length} services with images.`);

  for (const service of services) {
    if (!service.image) continue;

    // Extract publicId from the Cloudinary URL
    // e.g. https://res.cloudinary.com/xxx/image/upload/v123/portfolio/services/expressjs.png
    // → portfolio/services/expressjs
    const url = service.image;
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
      console.log(`⚠️  Skipping "${service.title}" — not a Cloudinary URL`);
      continue;
    }

    let publicId = url.substring(uploadIndex + 8).replace(/^v\d+\//, '');
    // Remove file extension for images
    publicId = publicId.replace(/\.[^/.]+$/, '');

    // Check if the image still exists in Cloudinary
    try {
      await cloudinary.api.resource(publicId);
      console.log(`✅ "${service.title}" — image OK, keeping.`);
    } catch (err) {
      if (err.http_code === 404 || err.error?.http_code === 404) {
        // Image no longer exists in Cloudinary → clear the URL
        service.image = '';
        await service.save();
        console.log(`🗑️  Cleared stale image from "${service.title}"`);
      } else {
        console.error(`❌ Error checking "${service.title}":`, err.message || err);
      }
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
