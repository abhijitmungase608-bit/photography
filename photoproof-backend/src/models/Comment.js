const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
      required: true
    },
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gallery',
      required: true
    },
    author: {
      type: String,
      required: true,
      default: 'Client'
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Comment', commentSchema);
