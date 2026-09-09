import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle2,
  Zap,
  Copy,
  Share2,
  ExternalLink,
  Lock,
  Download,
  MessageSquare,
  Heart,
  Sliders,
  Sparkles,
  FileSpreadsheet,
  Eye,
  Check
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { QUALITY_PRESETS, compressImageFile, formatBytes } from '../../utils/compression';

export default function GalleryDetail() {
  const { id } = useParams();
  const [gallery, setGallery] = useState(() => StorageService.getGalleryById(id) || StorageService.getGalleries()[0]);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [copiedLink, setCopiedLink] = useState(false);

  // Upload & Compression State
  const [selectedQuality, setSelectedQuality] = useState('balanced');
  const [autoCompress, setAutoCompress] = useState(true);
  const [convertToWebp, setConvertToWebp] = useState(true);
  const [generateThumbs, setGenerateThumbs] = useState(true);
  
  // Progress Simulation & Real Upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    originalGb: '2.4 GB',
    optimizedMb: '480 MB',
    savedGb: '1.92 GB'
  });
  const [uploadCompleted, setUploadCompleted] = useState(true);

  // Filter for Photos Grid
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [onlySelectedFilter, setOnlySelectedFilter] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [copiedLightroomNames, setCopiedLightroomNames] = useState(false);
  const [visiblePhotosCount, setVisiblePhotosCount] = useState(48);

  useEffect(() => {
    if (gallery) {
      const gPhotos = StorageService.getPhotosByGallery(gallery.id);
      setPhotos(gPhotos);
    }
  }, [gallery?.id]);

  const clientGalleryUrl = `${window.location.origin}/gallery/${gallery?.slug || 'rahul-priya-wedding'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientGalleryUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `Hi ${gallery.clientName}! Your private proofing gallery for "${gallery.title}" is ready.\n\n🔗 View & select your favorite photos here:\n${clientGalleryUrl}\n\n🔑 Password: ${gallery.password || 'wedding2026'}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSimulateBatchUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadCount(0);
    setUploadCompleted(false);

    let count = 0;
    const interval = setInterval(() => {
      count += 25;
      const pct = Math.min(100, Math.round((count / 500) * 100));
      setUploadCount(count);
      setUploadProgress(pct);

      if (count >= 500) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadCompleted(true);
        // Persist demo photos if gallery is empty or simulates batch
        const currentCount = StorageService.getPhotosByGallery(gallery.id).length;
        if (currentCount === 0) {
          StorageService.generateDemoPhotosForGallery(gallery.id, 500);
        }
        setPhotos(StorageService.getPhotosByGallery(gallery.id));
        setGallery(StorageService.getGalleryById(gallery.id));
      }
    }, 45);
  };

  const handleRealFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadCount(0);

    const processedPhotos = [];
    let origBytes = 0;
    let optBytes = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImageFile(files[i], {
          preset: selectedQuality,
          autoCompress,
          convertToWebp,
          generateThumb: generateThumbs
        });
        origBytes += compressed.originalSize;
        optBytes += compressed.compressedSize;
        processedPhotos.push(compressed);
        setUploadCount(i + 1);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.error('Compression error:', err);
      }
    }

    if (processedPhotos.length > 0) {
      StorageService.addPhotosToGallery(gallery.id, processedPhotos);
      setUploadStats({
        originalGb: formatBytes(origBytes),
        optimizedMb: formatBytes(optBytes),
        savedGb: formatBytes(Math.max(0, origBytes - optBytes))
      });
      setPhotos(StorageService.getPhotosByGallery(gallery.id));
      setGallery(StorageService.getGalleryById(gallery.id));
    }

    setIsUploading(false);
    setUploadCompleted(true);
  };

  const handleDownloadSelection = () => {
    const selected = photos.filter((p) => p.isSelected);
    if (selected.length === 0) {
      alert('No photos selected by client yet.');
      return;
    }
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Photo ID,Filename,Category,Comments'].join(',') + '\n' +
      selected.map((p) => `${p.photoNumber},${p.fileName},${p.category},"${p.comments?.map(c => c.text).join('; ') || ''}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${gallery.slug}_selections_${selected.length}_photos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLightroomFilenames = () => {
    const selected = photos.filter((p) => p.isSelected);
    if (selected.length === 0) {
      alert('No photos selected yet to copy.');
      return;
    }
    const filenames = selected.map((p) => p.fileName).join(', ');
    navigator.clipboard.writeText(filenames);
    setCopiedLightroomNames(true);
    setTimeout(() => setCopiedLightroomNames(false), 3000);
  };

  const selectedPhotos = photos.filter((p) => p.isSelected);
  const commentedPhotos = photos.filter((p) => p.comments && p.comments.length > 0);

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link to="/dashboard/galleries" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>
          ← Back to Galleries
        </Link>
      </div>

      {/* Gallery Header Card */}
      <div className="glass-card" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={gallery.coverImage}
            alt={gallery.title}
            style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{gallery.title}</h1>
              {gallery.status === 'completed' ? (
                <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                  Selection Completed
                </span>
              ) : (
                <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>
                  Active Proofing
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Client: <strong style={{ color: '#0f172a' }}>{gallery.clientName}</strong> • {gallery.totalPhotos} Photos • Limit: {gallery.selectionLimit}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleCopyLink} className="btn btn-secondary btn-sm" style={{ fontSize: '0.76rem' }}>
            <Copy size={12} />
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button onClick={handleWhatsAppShare} className="btn btn-success btn-sm" style={{ fontSize: '0.76rem' }}>
            <Share2 size={12} />
            <span>WhatsApp Share</span>
          </button>

          <Link to={`/gallery/${gallery.slug}`} target="_blank" className="btn btn-gold btn-sm" style={{ fontSize: '0.76rem' }}>
            <ExternalLink size={12} />
            <span>Client View</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'upload', label: '📤 Upload Photos (Smart Compression)' },
          { id: 'results', label: `✅ Client Selection (${selectedPhotos.length}/${gallery.selectionLimit})` },
          { id: 'photos', label: `🖼️ Photos Grid (${photos.length})` },
          { id: 'comments', label: `💬 Comments (${commentedPhotos.length})` },
          { id: 'share', label: '🔗 Private Link & Security' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.55rem 0.95rem',
              background: activeTab === tab.id ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #d97706' : '2px solid transparent',
              color: activeTab === tab.id ? '#b45309' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: UPLOAD & SMART COMPRESSION */}
      {activeTab === 'upload' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.15rem' }}>
              Upload Photos — <span style={{ color: '#d97706' }}>⭐ Smart Compression</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Photos automatically compress from 8.2 MB to ~950 KB in-browser before upload.
            </p>
          </div>

          {/* Upload Drop Zone */}
          <div className="glass-card" style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            border: '2px dashed #fed7aa',
            background: '#fffbf5',
            marginBottom: '1.25rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: '#d97706'
            }}>
              <UploadCloud size={26} />
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Drag & Drop your photos here
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Supports RAW, JPEG, PNG, or WebP
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <label className="btn btn-gold" style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleRealFileUpload}
                  style={{ display: 'none' }}
                />
                <span>+ Upload Photos</span>
              </label>

              <button
                onClick={handleSimulateBatchUpload}
                className="btn btn-secondary"
                disabled={isUploading}
              >
                <span>⚡ Simulate 500 Photos Batch</span>
              </button>
            </div>
          </div>

          {/* Upload Settings Card */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sliders size={15} color="#d97706" />
              <span>Upload Settings</span>
            </h3>

            {/* Quality Presets */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Quality Preset
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.65rem'
              }}>
                {Object.entries(QUALITY_PRESETS).map(([key, preset]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedQuality(key)}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedQuality === key ? '#fffbeb' : '#ffffff',
                      border: selectedQuality === key ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{preset.name}</strong>
                      {preset.recommended && (
                        <span style={{ fontSize: '0.62rem', color: '#b45309', fontWeight: 700 }}>
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                      {preset.targetSize}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {preset.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.84rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={autoCompress} onChange={(e) => setAutoCompress(e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                <span>Automatically compress images</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={convertToWebp} onChange={(e) => setConvertToWebp(e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                <span>Convert to WebP</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={generateThumbs} onChange={(e) => setGenerateThumbs(e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                <span>Generate thumbnails</span>
              </label>
            </div>
          </div>

          {/* Progress Box */}
          {(isUploading || uploadCompleted) && (
            <div className="glass-card" style={{
              padding: '1.25rem',
              border: '1px solid #a7f3d0',
              background: '#f0fdf4'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#065f46' }}>
                  {isUploading ? (
                    <>
                      <Zap size={15} color="#d97706" />
                      <span>Optimizing & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} color="#059669" />
                      <span>500 photos uploaded successfully ✅</span>
                    </>
                  )}
                </div>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#065f46' }}>
                  {isUploading ? `${uploadProgress}%` : '100%'}
                </span>
              </div>

              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                <div style={{ width: `${isUploading ? uploadProgress : 100}%`, height: '100%', background: '#059669', borderRadius: '4px' }} />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.65rem',
                padding: '0.75rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #d1fae5',
                fontSize: '0.82rem'
              }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Photos</div>
                  <div style={{ fontWeight: 700 }}>{isUploading ? uploadCount : 500} / 500 photos</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Original</div>
                  <div style={{ fontWeight: 700, color: '#dc2626' }}>{uploadStats.originalGb}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Optimized</div>
                  <div style={{ fontWeight: 700, color: '#059669' }}>{uploadStats.optimizedMb}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Saved</div>
                  <div style={{ fontWeight: 800, color: '#b45309' }}>
                    Saved: {uploadStats.savedGb} 🎉
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>
                You saved {uploadStats.savedGb} with Smart Compression.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESULTS */}
      {activeTab === 'results' && (
        <div>
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid #a7f3d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.35rem' }}>Summary</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>{gallery.title}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>Client: {gallery.clientName}</div>
              </div>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)', color: '#065f46', fontWeight: 700, fontSize: '0.84rem' }}>
                ✅ Status: Selection Completed
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Photos</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{gallery.totalPhotos}</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.72rem', color: '#059669' }}>Selected Photos</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>{selectedPhotos.length}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pending</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>0</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button onClick={() => { setActiveTab('photos'); setOnlySelectedFilter(true); }} className="btn btn-gold btn-sm">
                <Eye size={14} />
                <span>View Selected Photos ({selectedPhotos.length})</span>
              </button>
              <button onClick={handleDownloadSelection} className="btn btn-secondary btn-sm">
                <FileSpreadsheet size={14} color="#059669" />
                <span>Download Selection (Lightroom / CSV)</span>
              </button>
              <button onClick={handleCopyLightroomFilenames} className="btn btn-secondary btn-sm">
                <Copy size={14} color="#d97706" />
                <span>{copiedLightroomNames ? `✓ Copied ${selectedPhotos.length} Filenames!` : 'Copy Lightroom Filenames'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHOTOS */}
      {activeTab === 'photos' && (() => {
        const filteredList = photos
          .filter((p) => categoryFilter === 'All' || p.category === categoryFilter)
          .filter((p) => !onlySelectedFilter || p.isSelected);

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {['All', 'Haldi', 'Sangeet', 'Wedding', 'Reception', 'Portraits'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategoryFilter(cat); setVisiblePhotosCount(48); }}
                    className="btn btn-sm"
                    style={{
                      background: categoryFilter === cat ? '#f59e0b' : '#ffffff',
                      color: categoryFilter === cat ? '#0f172a' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 700
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.82rem' }}>
                <input type="checkbox" checked={onlySelectedFilter} onChange={(e) => { setOnlySelectedFilter(e.target.checked); setVisiblePhotosCount(48); }} style={{ accentColor: '#10b981' }} />
                <span>Show Selected Only ({selectedPhotos.length})</span>
              </label>
            </div>

            {filteredList.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No photos found matching this filter.</p>
                <button onClick={handleSimulateBatchUpload} className="btn btn-gold btn-sm">
                  ⚡ Simulate 500 Photos Batch
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.65rem' }}>
                  {filteredList.slice(0, visiblePhotosCount).map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhotoModal(photo)}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        aspectRatio: '1',
                        cursor: 'pointer',
                        border: photo.isSelected ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                        background: '#f1f5f9'
                      }}
                    >
                      <img src={photo.thumbnailUrl} alt={photo.fileName} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {photo.isSelected && (
                        <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#10b981', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.65)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.65rem', color: '#fff' }}>
                        #{photo.photoNumber}
                      </div>
                    </div>
                  ))}
                </div>

                {visiblePhotosCount < filteredList.length && (
                  <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setVisiblePhotosCount((prev) => prev + 48)} className="btn btn-secondary btn-sm">
                      Load More Photos (+48)
                    </button>
                    <button onClick={() => setVisiblePhotosCount(filteredList.length)} className="btn btn-gold btn-sm">
                      Show All ({filteredList.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })()}

      {/* TAB 4: COMMENTS */}
      {activeTab === 'comments' && (
        <div style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.15rem' }}>Client Edit Requests</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Comments submitted by client during proofing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {commentedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="glass-card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  border: photo.photoNumber === 182 ? '2px solid #f59e0b' : '1px solid var(--border-subtle)'
                }}
              >
                <img src={photo.thumbnailUrl} alt={photo.fileName} style={{ width: '74px', height: '74px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong>Photo #{photo.photoNumber} ({photo.fileName})</strong>
                    {photo.isFavorite && <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>❤️ Favorite</span>}
                  </div>
                  {photo.comments?.map((c, i) => (
                    <div key={i} style={{ padding: '0.55rem 0.75rem', background: '#fffbeb', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #d97706', marginBottom: '0.25rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>{c.author} (Client requested editing):</div>
                      <div style={{ fontSize: '0.84rem', color: '#0f172a' }}>"{c.text}"</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SHARE */}
      {activeTab === 'share' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Private Gallery Link</h2>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Link</label>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <input type="text" readOnly className="form-input" value={clientGalleryUrl} />
                <button onClick={handleCopyLink} className="btn btn-gold btn-sm">
                  <Copy size={13} />
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <button onClick={handleWhatsAppShare} className="btn btn-success" style={{ width: '100%', padding: '0.65rem' }}>
                <Share2 size={15} />
                <span>Send via WhatsApp to {gallery.clientName}</span>
              </button>
            </div>

            <div style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Password</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#b45309', fontWeight: 700 }}>
                {gallery.password || 'wedding2026'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal preview */}
      {selectedPhotoModal && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPhotoModal(null)}>
          <div className="glass-card" style={{ maxWidth: '700px', width: '100%', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ maxHeight: '60vh', background: '#0f172a' }}>
              <img src={selectedPhotoModal.url} alt={selectedPhotoModal.fileName} style={{ width: '100%', height: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Photo #{selectedPhotoModal.photoNumber}</strong> ({selectedPhotoModal.fileName})
              </div>
              <button onClick={() => setSelectedPhotoModal(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
