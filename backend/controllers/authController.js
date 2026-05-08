import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  // If no user exists yet, let's create a default admin using the provided credentials
  // This allows the first login to set the credentials
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    user = await User.create({
      username,
      password
    });
    return res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile / password
// @route   PUT /api/auth/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;

    if (req.body.password) {
      user.oldPassword = user.password; // store old hashed password
      user.password = req.body.password; // will be hashed by pre-save hook
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
