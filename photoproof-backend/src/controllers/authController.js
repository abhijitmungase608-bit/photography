const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'photoproof_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * @desc    Register new photographer
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, studioName, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Photographer already exists with this email' });
    }

    const user = await User.create({
      name,
      studioName: studioName || 'Studio One Photography',
      email,
      password,
      phone: phone || '+91 98765 00000'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        studioName: user.studioName,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        storageUsedBytes: user.storageUsedBytes,
        storageLimitBytes: user.storageLimitBytes,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate photographer & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        studioName: user.studioName,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        storageUsedBytes: user.storageUsedBytes,
        storageLimitBytes: user.storageLimitBytes,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in photographer
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update photographer studio profile & watermark
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, studioName, phone, watermarkText, watermarkEnabled } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (studioName) user.studioName = studioName;
    if (phone) user.phone = phone;
    if (watermarkText !== undefined) user.watermarkText = watermarkText;
    if (watermarkEnabled !== undefined) user.watermarkEnabled = watermarkEnabled;

    const updatedUser = await user.save();
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
