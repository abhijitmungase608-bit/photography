const express = require('express');
const router = express.Router();
const {
  accessClientGallery,
  togglePhotoSelection,
  addPhotoComment,
  submitFinalSelection,
  getClientsSummary
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

// Client portal endpoints
router.post('/gallery/:slug', accessClientGallery);
router.patch('/photos/:id/select', togglePhotoSelection);
router.post('/photos/:id/comment', addPhotoComment);
router.post('/gallery/:id/submit', submitFinalSelection);

// Photographer directory endpoint
router.get('/list', protect, getClientsSummary);

module.exports = router;
