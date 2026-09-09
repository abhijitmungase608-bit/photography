const multer = require('multer');

// Store in memory for instant sharp compression & Cloudinary streaming
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow all standard image and common camera formats
  if (
    file.mimetype.startsWith('image/') ||
    file.originalname.match(/\.(jpg|jpeg|png|webp|cr2|cr3|nef|arw|dng|raw)$/i)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, RAW) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB per file limit
  },
  fileFilter
});

module.exports = upload;
