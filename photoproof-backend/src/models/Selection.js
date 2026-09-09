const mongoose = require('mongoose');

const selectionSchema = new mongoose.Schema(
  {
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gallery',
      required: true
    },
    selectedPhotos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo'
      }
    ],
    clientNotes: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['submitted', 'in_review', 'approved'],
      default: 'submitted'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Selection', selectionSchema);
