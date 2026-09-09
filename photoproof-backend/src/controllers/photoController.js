const Photo = require('../models/Photo');
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const imageService = require('../services/imageService');

/**
 * @desc    Upload & compress photos for a gallery
 * @route   POST /api/photos/upload/:galleryId
 * @access  Private
 */
const uploadPhotos = async (req, res, next) => {
  try {
    const { galleryId } = req.params;
    const gallery = await Gallery.findOne({ _id: galleryId, photographer: req.user._id });

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide photos to upload' });
    }

    const existingPhotosCount = await Photo.countDocuments({ gallery: gallery._id });
    const uploadedRecords = [];
    let totalOrigBytes = 0;
    let totalOptBytes = 0;

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const photoNumber = existingPhotosCount + i + 1;

      // Process and compress image with sharp & Cloudinary
      const processed = await imageService.processAndUploadPhoto(file, `photoproof/${gallery.slug}`);

      totalOrigBytes += processed.originalSizeBytes;
      totalOptBytes += processed.compressedSizeBytes;

      const photo = await Photo.create({
        gallery: gallery._id,
        photographer: req.user._id,
        photoNumber,
        fileName: file.originalname,
        originalUrl: processed.originalUrl,
        compressedUrl: processed.compressedUrl,
        thumbnailUrl: processed.thumbnailUrl,
        category: req.body.category || 'Wedding',
        originalSizeBytes: processed.originalSizeBytes,
        compressedSizeBytes: processed.compressedSizeBytes,
        dimensions: processed.dimensions
      });

      uploadedRecords.push(photo);
    }

    // Update gallery counters
    const savedBytes = Math.max(0, totalOrigBytes - totalOptBytes);
    gallery.totalPhotos += uploadedRecords.length;
    gallery.savedStorageBytes = (gallery.savedStorageBytes || 0) + savedBytes;
    await gallery.save();

    // Update photographer storage usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsedBytes: totalOptBytes }
    });

    res.status(201).json({
      success: true,
      count: uploadedRecords.length,
      savedStorageBytes: savedBytes,
      data: uploadedRecords
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get photos for a gallery
 * @route   GET /api/photos/gallery/:galleryId
 * @access  Public / Private
 */
const getPhotosByGallery = async (req, res, next) => {
  try {
    const { galleryId } = req.params;
    const { category, selectedOnly, page = 1, limit = 50 } = req.query;

    const query = { gallery: galleryId };
    if (category && category !== 'All') {
      query.category = category;
    }
    if (selectedOnly === 'true') {
      query.isSelected = true;
    }

    const photos = await Photo.find(query)
      .sort({ photoNumber: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Photo.countDocuments(query);

    res.json({
      success: true,
      count: photos.length,
      total,
      data: photos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete single photo
 * @route   DELETE /api/photos/:id
 * @access  Private
 */
const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findOneAndDelete({ _id: req.params.id, photographer: req.user._id });
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Decrement gallery count
    await Gallery.findByIdAndUpdate(photo.gallery, {
      $inc: { totalPhotos: -1 }
    });

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle favorite status of photo
 * @route   PATCH /api/photos/:id/favorite
 * @access  Public / Private
 */
const toggleFavorite = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    photo.isFavorite = !photo.isFavorite;
    await photo.save();

    res.json({ success: true, data: photo });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPhotos,
  getPhotosByGallery,
  deletePhoto,
  toggleFavorite
};
