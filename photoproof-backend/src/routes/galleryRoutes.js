const express = require('express');
const router = express.Router();
const {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  exportSelectionCsv
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getGalleries)
  .post(protect, createGallery);

router.route('/:id')
  .get(protect, getGalleryById)
  .put(protect, updateGallery)
  .delete(protect, deleteGallery);

router.get('/:id/export-csv', protect, exportSelectionCsv);

module.exports = router;
