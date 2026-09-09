const express = require('express');
const router = express.Router();
const {
  uploadPhotos,
  getPhotosByGallery,
  deletePhoto,
  toggleFavorite
} = require('../controllers/photoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload/:galleryId', protect, upload.array('photos', 100), uploadPhotos);
router.get('/gallery/:galleryId', getPhotosByGallery);
router.delete('/:id', protect, deletePhoto);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
