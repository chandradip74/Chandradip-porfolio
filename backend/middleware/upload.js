import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import Resource from '../models/Resource.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept image files and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for production
});

/**
 * Uploads a buffer to Cloudinary and optionally saves it as a Resource.
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder
 * @param {string} resourceType - 'auto', 'image', 'video', 'raw'
 * @param {Object} [metadata] - Optional file metadata (name, size, format)
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadToCloudinary = (buffer, folder, resourceType = 'auto', metadata = null) => {
  return new Promise((resolve, reject) => {
    
    const uploadOptions = { 
      folder: `portfolio/${folder}`, 
      resource_type: resourceType,
    };

    // Apply optimization if it's an image
    if (resourceType === 'image' || resourceType === 'auto') {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' } // Image optimization
      ];
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      async (error, result) => {
        if (result) {
          // If metadata is provided, save as a Resource
          if (metadata) {
            try {
              await Resource.create({
                name: metadata.name || result.original_filename || 'unnamed',
                url: result.secure_url,
                resourceType: result.resource_type || 'auto',
                format: result.format || metadata.format,
                size: result.bytes || metadata.size,
              });
            } catch (resErr) {
              console.error('Failed to save resource metadata:', resErr);
            }
          }
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
