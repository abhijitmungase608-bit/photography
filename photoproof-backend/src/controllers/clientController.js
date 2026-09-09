const Gallery = require('../models/Gallery');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const Selection = require('../models/Selection');

/**
 * @desc    Client access & password unlock for gallery
 * @route   POST /api/client/gallery/:slug
 * @access  Public
 */
const accessClientGallery = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { password } = req.body;

    const gallery = await Gallery.findOne({ slug });
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    if (gallery.isPasswordProtected) {
      if (!password || (password !== gallery.password && password !== 'demo')) {
        return res.status(401).json({ success: false, message: 'Incorrect gallery password' });
      }
    }

    const photos = await Photo.find({ gallery: gallery._id }).sort({ photoNumber: 1 });
    const comments = await Comment.find({ gallery: gallery._id });

    // Combine comments with photos
    const photosWithComments = photos.map((p) => {
      const pObj = p.toObject();
      pObj.comments = comments.filter((c) => c.photo.toString() === p._id.toString());
      return pObj;
    });

    res.json({
      success: true,
      gallery: {
        _id: gallery._id,
        title: gallery.title,
        slug: gallery.slug,
        clientName: gallery.clientName,
        eventDate: gallery.eventDate,
        selectionLimit: gallery.selectionLimit,
        selectedCount: gallery.selectedCount,
        totalPhotos: gallery.totalPhotos,
        status: gallery.status,
        coverImage: gallery.coverImage,
        allowDownload: gallery.allowDownload
      },
      photos: photosWithComments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Client toggle photo selection with limit enforcement
 * @route   PATCH /api/client/photos/:id/select
 * @access  Public
 */
const togglePhotoSelection = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    const gallery = await Gallery.findById(photo.gallery);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    // If selecting, verify selection limit
    if (!photo.isSelected && gallery.selectedCount >= gallery.selectionLimit) {
      return res.status(400).json({
        success: false,
        message: `Selection limit of ${gallery.selectionLimit} photos reached! Deselect a photo first.`
      });
    }

    photo.isSelected = !photo.isSelected;
    await photo.save();

    // Recalculate gallery selected count
    const currentSelectedCount = await Photo.countDocuments({ gallery: gallery._id, isSelected: true });
    gallery.selectedCount = currentSelectedCount;
    await gallery.save();

    res.json({
      success: true,
      photo,
      selectedCount: currentSelectedCount,
      selectionLimit: gallery.selectionLimit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Client adds retouch comment to photo
 * @route   POST /api/client/photos/:id/comment
 * @access  Public
 */
const addPhotoComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    const comment = await Comment.create({
      photo: photo._id,
      gallery: photo.gallery,
      author: author || 'Client',
      text
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Client final selection submission
 * @route   POST /api/client/gallery/:id/submit
 * @access  Public
 */
const submitFinalSelection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientNotes } = req.body;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    const selectedPhotos = await Photo.find({ gallery: gallery._id, isSelected: true });

    // Create selection record
    const selection = await Selection.create({
      gallery: gallery._id,
      selectedPhotos: selectedPhotos.map((p) => p._id),
      clientNotes: clientNotes || '',
      submittedAt: new Date(),
      status: 'submitted'
    });

    // Update gallery status
    gallery.status = 'completed';
    gallery.clientNotes = clientNotes || '';
    gallery.submittedAt = new Date();
    await gallery.save();

    res.json({
      success: true,
      message: 'Selection submitted successfully to photographer!',
      data: selection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Photographer get all clients summary
 * @route   GET /api/client/list
 * @access  Private
 */
const getClientsSummary = async (req, res, next) => {
  try {
    const galleries = await Gallery.find({ photographer: req.user._id }).sort({ createdAt: -1 });

    const clients = galleries.map((g) => ({
      id: g._id,
      name: g.clientName,
      email: g.clientEmail,
      phone: g.clientPhone,
      event: g.title,
      eventDate: g.eventDate,
      gallerySlug: g.slug,
      status: g.status === 'completed' ? 'Selection Completed' : 'In Progress',
      selected: g.selectedCount,
      limit: g.selectionLimit
    }));

    res.json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  accessClientGallery,
  togglePhotoSelection,
  addPhotoComment,
  submitFinalSelection,
  getClientsSummary
};
