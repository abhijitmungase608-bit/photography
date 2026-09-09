/**
 * Smart Image Compression Engine
 * Compresses images client-side before uploading:
 * - Resizes to max dimensions (preserving aspect ratio)
 * - Converts to optimized WebP
 * - Generates fast lightweight thumbnails (400px)
 * - Computes byte-level compression savings
 */

export const QUALITY_PRESETS = {
  economy: {
    name: 'Economy',
    targetSize: '~500–800 KB',
    maxDimension: 1600,
    quality: 0.65,
    description: 'Ultra-efficient proofing for fast loading'
  },
  balanced: {
    name: 'Balanced',
    targetSize: '~800 KB–1.5 MB',
    maxDimension: 2000,
    quality: 0.80,
    description: 'Perfect balance of crisp detail & compact size',
    recommended: true
  },
  high: {
    name: 'High Quality',
    targetSize: '~2–3 MB',
    maxDimension: 2560,
    quality: 0.90,
    description: 'Maximum visual fidelity for premium albums'
  }
};

/**
 * Format bytes to readable string (e.g., 8.2 MB, 950 KB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Compress an actual File object using HTML5 Canvas
 */
export async function compressImageFile(file, options = {}) {
  const {
    preset = 'balanced',
    convertToWebp = true,
    autoCompress = true,
    generateThumb = true
  } = options;

  const currentPreset = QUALITY_PRESETS[preset] || QUALITY_PRESETS.balanced;
  const originalSize = file.size;

  // If compression is disabled, return original file as object URL
  if (!autoCompress) {
    const originalUrl = URL.createObjectURL(file);
    return {
      fileName: file.name,
      originalSize,
      compressedSize: originalSize,
      savedBytes: 0,
      savedPercent: 0,
      url: originalUrl,
      thumbnailUrl: originalUrl
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          const maxDim = currentPreset.maxDimension;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          // Main Canvas for optimized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const mimeType = convertToWebp ? 'image/webp' : file.type || 'image/jpeg';
          
          canvas.toBlob((optimizedBlob) => {
            if (!optimizedBlob) {
              return reject(new Error('Image conversion failed'));
            }

            const optimizedSize = optimizedBlob.size;
            const optimizedUrl = URL.createObjectURL(optimizedBlob);

            // Generate thumbnail (~400px) if requested
            let thumbUrl = optimizedUrl;
            if (generateThumb) {
              const thumbCanvas = document.createElement('canvas');
              const thumbMax = 400;
              let tw = width;
              let th = height;
              if (tw > thumbMax || th > thumbMax) {
                if (tw > th) {
                  th = Math.round((th * thumbMax) / tw);
                  tw = thumbMax;
                } else {
                  tw = Math.round((tw * thumbMax) / th);
                  th = thumbMax;
                }
              }
              thumbCanvas.width = tw;
              thumbCanvas.height = th;
              const tCtx = thumbCanvas.getContext('2d');
              tCtx.drawImage(img, 0, 0, tw, th);
              thumbUrl = thumbCanvas.toDataURL('image/webp', 0.7);
            }

            const savedBytes = Math.max(0, originalSize - optimizedSize);
            const savedPercent = Math.round((savedBytes / originalSize) * 100);

            resolve({
              fileName: file.name.replace(/\.[^/.]+$/, '') + (convertToWebp ? '.webp' : ''),
              originalSize,
              compressedSize: optimizedSize,
              savedBytes,
              savedPercent,
              url: optimizedUrl,
              thumbnailUrl: thumbUrl,
              dimensions: { width, height }
            });
          }, mimeType, currentPreset.quality);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image into memory'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
