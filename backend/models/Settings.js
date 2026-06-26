import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      required: true,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: "We're performing scheduled maintenance to improve your experience. Please check back shortly.",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
