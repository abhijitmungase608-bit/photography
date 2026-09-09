const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide gallery title'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    clientName: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true
    },
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    clientPhone: {
      type: String,
      trim: true
    },
    eventDate: {
      type: Date,
      default: Date.now
    },
    selectionLimit: {
      type: Number,
      default: 100,
      min: 1
    },
    selectedCount: {
      type: Number,
      default: 0
    },
    totalPhotos: {
      type: Number,
      default: 0
    },
    isPasswordProtected: {
      type: Boolean,
      default: true
    },
    password: {
      type: String,
      default: 'wedding2026'
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    },
    savedStorageBytes: {
      type: Number,
      default: 0
    },
    allowDownload: {
      type: Boolean,
      default: true
    },
    clientNotes: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Generate slug before validate
gallerySchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${Math.floor(100 + Math.random() * 900)}`;
  }
  next();
});

module.exports = mongoose.model('Gallery', gallerySchema);
