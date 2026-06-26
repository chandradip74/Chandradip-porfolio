import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
    default: "We're performing scheduled maintenance. We'll be back shortly!",
  },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
