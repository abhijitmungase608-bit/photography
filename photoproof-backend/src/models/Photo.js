const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gallery',
      required: true
    },
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    photoNumber: {
      type: Number,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    originalUrl: {
      type: String,
      required: true
    },
    compressedUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['All', 'Wedding', 'Haldi', 'Sangeet', 'Reception', 'Portraits', 'Other'],
      default: 'Wedding'
    },
    originalSizeBytes: {
      type: Number,
      default: 8200000 // ~8.2 MB
    },
    compressedSizeBytes: {
      type: Number,
      default: 950000 // ~950 KB
    },
    dimensions: {
      width: { type: Number, default: 2000 },
      height: { type: Number, default: 1333 }
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

photoSchema.index({ gallery: 1, photoNumber: 1 });

module.exports = mongoose.model('Photo', photoSchema);
