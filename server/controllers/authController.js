import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isConnected } from '../config/db.js';

// In-Memory mock storage for local mode
export const MOCK_USERS = [
  {
    id: 'mock-user-1',
    name: 'Aura Photographer',
    email: 'photographer@example.com',
    passwordHash: '$2a$10$wK1Vq4qg4x2lSj.qV5X/vumgH63qN8Lp6C28a9F0Rk7aD.9Z0xH.e' // hash for "password123"
  }
];

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback-secret-key-123456',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new photographer user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all details' });
  }

  try {
    if (isConnected) {
      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Photographer already exists' });
      }

      const user = await User.create({ name, email, password });
      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Mock In-Memory Register
      const userExists = MOCK_USERS.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Photographer already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = {
        id: `mock-user-${Date.now()}`,
        name,
        email,
        passwordHash
      };

      MOCK_USERS.push(newUser);

      return res.status(201).json({
        success: true,
        token: generateToken(newUser.id),
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login photographer
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    if (isConnected) {
      // Find user and select password explicitly
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Mock In-Memory Login
      const user = MOCK_USERS.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        token: generateToken(user.id),
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (isConnected) {
      const user = await User.findById(req.user.id);
      res.status(200).json({ success: true, user });
    } else {
      // Local Mode
      const user = MOCK_USERS.find(u => u.id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
