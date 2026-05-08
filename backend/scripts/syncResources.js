import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile.js';
import Achievement from '../models/Achievement.js';
import Project from '../models/Project.js';
import Technology from '../models/Technology.js';
import Resource from '../models/Resource.js';
import connectDB from '../config/db.js';

dotenv.config();

const syncResources = async () => {
  await connectDB();

  console.log('Starting resource synchronization...');

  const resourcesToAdd = [];

  const addResource = (url, name, type = 'image') => {
    if (url && url.startsWith('http')) {
      resourcesToAdd.push({
        url,
        name: name || 'Uploaded File',
        resourceType: url.endsWith('.pdf') ? 'raw' : 'image',
        format: url.split('.').pop(),
        size: 0, // Unknown for existing
      });
    }
  };

  // 1. Scan Profiles
  const profiles = await Profile.find({});
  profiles.forEach(p => {
    addResource(p.profileImage, `Profile Image - ${p.name}`);
    addResource(p.cvFile, `CV - ${p.name}`, 'raw');
  });

  // 2. Scan Achievements
  const achievements = await Achievement.find({});
  achievements.forEach(a => {
    addResource(a.certificateImage, `Certificate - ${a.title}`);
    addResource(a.iconPath, `Icon - ${a.title}`);
  });

  // 3. Scan Projects
  const projects = await Project.find({});
  projects.forEach(p => {
    addResource(p.image, `Project - ${p.title}`);
  });

  // 4. Scan Technologies
  const techs = await Technology.find({});
  techs.forEach(t => {
    addResource(t.iconPath, `Tech Icon - ${t.technologyName}`);
  });

  console.log(`Found ${resourcesToAdd.length} potential resources. Checking for duplicates...`);

  let addedCount = 0;
  for (const res of resourcesToAdd) {
    const exists = await Resource.findOne({ url: res.url });
    if (!exists) {
      await Resource.create(res);
      addedCount++;
    }
  }

  console.log(`Synchronization complete. Added ${addedCount} new resources to Media Library.`);
  process.exit(0);
};

syncResources();
