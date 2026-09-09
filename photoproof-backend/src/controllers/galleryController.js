const Gallery = require('../models/Gallery');
const Photo = require('../models/Photo');

/**
 * @desc    Create new gallery
 * @route   POST /api/galleries
 * @access  Private
 */
const createGallery = async (req, res, next) => {
  try {
    const {
      title,
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      selectionLimit,
      isPasswordProtected,
      password,
      allowDownload
    } = req.body;

    if (!title || !clientName) {
      return res.status(400).json({ success: false, message: 'Title and Client Name are required' });
    }

    const gallery = await Gallery.create({
      photographer: req.user._id,
      title,
      clientName,
      clientEmail,
      clientPhone,
      eventDate: eventDate || Date.now(),
      selectionLimit: selectionLimit || 100,
      isPasswordProtected: isPasswordProtected !== undefined ? isPasswordProtected : true,
      password: password || 'wedding2026',
      allowDownload: allowDownload !== undefined ? allowDownload : true
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all galleries for logged in photographer
 * @route   GET /api/galleries
 * @access  Private
 */
const getGalleries = async (req, res, next) => {
  try {
    const galleries = await Gallery.find({ photographer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: galleries.length, data: galleries });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single gallery by ID or Slug
 * @route   GET /api/galleries/:id
 * @access  Private
 */
const getGalleryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let gallery;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      gallery = await Gallery.findOne({ _id: id, photographer: req.user._id });
    } else {
      gallery = await Gallery.findOne({ slug: id, photographer: req.user._id });
    }

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    res.json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update gallery
 * @route   PUT /api/galleries/:id
 * @access  Private
 */
const updateGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findOneAndUpdate(
      { _id: req.params.id, photographer: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    res.json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete gallery and its photos
 * @route   DELETE /api/galleries/:id
 * @access  Private
 */
const deleteGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findOneAndDelete({ _id: req.params.id, photographer: req.user._id });
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    // Delete associated photos
    await Photo.deleteMany({ gallery: gallery._id });

    res.json({ success: true, message: 'Gallery and photos deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export client selections as Lightroom CSV
 * @route   GET /api/galleries/:id/export-csv
 * @access  Private
 */
const exportSelectionCsv = async (req, res, next) => {
  try {
    const gallery = await Gallery.findOne({ _id: req.params.id, photographer: req.user._id });
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    const selectedPhotos = await Photo.find({ gallery: gallery._id, isSelected: true }).sort({ photoNumber: 1 });

    const csvRows = ['Photo ID,Filename,Category,Selected'];
    selectedPhotos.forEach((p) => {
      csvRows.push(`${p.photoNumber},${p.fileName},${p.category},Yes`);
    });

    const csvString = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${gallery.slug}_selections.csv"`);
    res.send(csvString);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  exportSelectionCsv
};
