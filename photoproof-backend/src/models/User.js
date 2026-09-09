const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide photographer name'],
      trim: true
    },
    studioName: {
      type: String,
      required: [true, 'Please provide studio name'],
      trim: true,
      default: 'My Studio Photography'
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      default: '+91 80109471110'
    },
    upiNumber: {
      type: String,
      default: '80109471110'
    },
    upiId: {
      type: String,
      default: '80109471110@upi'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    role: {
      type: String,
      enum: ['photographer', 'admin'],
      default: 'photographer'
    },
    plan: {
      type: String,
      enum: ['FREE', 'STARTER', 'PRO', 'STUDIO'],
      default: 'PRO'
    },
    storageUsedBytes: {
      type: Number,
      default: 72 * 1024 * 1024 * 1024 // 72 GB default
    },
    storageLimitBytes: {
      type: Number,
      default: 100 * 1024 * 1024 * 1024 // 100 GB default
    },
    watermarkText: {
      type: String,
      default: '© Studio One Photography'
    },
    watermarkEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Hash password prior to saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
