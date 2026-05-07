import Project from '../models/Project.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, projectLink, technologies } = req.body;
  
  let imageUrl = '';
  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.buffer, 'projects');
  }

  const project = new Project({
    title,
    description,
    projectLink,
    technologies: technologies ? (Array.isArray(technologies) ? technologies : JSON.parse(technologies)) : [],
    image: imageUrl || req.body.image,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

export const updateProject = asyncHandler(async (req, res) => {
  const { title, description, projectLink, technologies } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.projectLink = projectLink || project.projectLink;
    if (technologies) {
      project.technologies = Array.isArray(technologies) ? technologies : JSON.parse(technologies);
    }

    if (req.file) {
      project.image = await uploadToCloudinary(req.file.buffer, 'projects');
    } else if (req.body.image) {
      project.image = req.body.image;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});
