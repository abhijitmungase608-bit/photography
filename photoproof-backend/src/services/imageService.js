const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');

/**
 * Smart Image Compression & Thumbnail Service
 * - Resizes large images (e.g. 8.2 MB) down to Web-Optimized WebP (~950 KB)
 * - Generates fast 400px thumbnails
 * - Streams buffers directly to Cloudinary
 */
class ImageService {
  /**
   * Compress image buffer to WebP with target max dimension
   */
  async compressImage(buffer, options = {}) {
    const { maxDimension = 2000, quality = 80 } = options;

    const metadata = await sharp(buffer).metadata();
    let { width, height } = metadata;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const compressedBuffer = await sharp(buffer)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    return {
      buffer: compressedBuffer,
      originalSize: buffer.length,
      compressedSize: compressedBuffer.length,
      savedBytes: Math.max(0, buffer.length - compressedBuffer.length),
      dimensions: { width, height }
    };
  }

  /**
   * Generate lightweight 400px thumbnail
   */
  async generateThumbnail(buffer, maxDim = 400) {
    return await sharp(buffer)
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();
  }

  /**
   * Upload buffer directly to Cloudinary
   */
  async uploadToCloudinary(buffer, folder = 'photoproof') {
    return new Promise((resolve, reject) => {
      // If Cloudinary credentials are not configured, fallback gracefully to a mock data url
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name'
      ) {
        const base64 = buffer.toString('base64');
        return resolve({
          secure_url: `data:image/webp;base64,${base64.substring(0, 100)}...`,
          public_id: `local_${Date.now()}`
        });
      }

      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', format: 'webp' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });
  }

  /**
   * Process a single uploaded file
   */
  async processAndUploadPhoto(file, folder = 'photoproof') {
    const compressed = await this.compressImage(file.buffer);
    const thumbBuffer = await this.generateThumbnail(compressed.buffer);

    const mainUpload = await this.uploadToCloudinary(compressed.buffer, `${folder}/full`);
    const thumbUpload = await this.uploadToCloudinary(thumbBuffer, `${folder}/thumbs`);

    return {
      fileName: file.originalname.replace(/\.[^/.]+$/, '') + '.webp',
      originalUrl: mainUpload.secure_url,
      compressedUrl: mainUpload.secure_url,
      thumbnailUrl: thumbUpload.secure_url,
      originalSizeBytes: compressed.originalSize,
      compressedSizeBytes: compressed.compressedSize,
      dimensions: compressed.dimensions
    };
  }
}

module.exports = new ImageService();
