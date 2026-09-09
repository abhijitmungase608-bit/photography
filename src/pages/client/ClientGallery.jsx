import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heart,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Camera,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';

export default function ClientGallery() {
  const { gallerySlug } = useParams();

  // Load Gallery dynamically
  const [gallery, setGallery] = useState(() =>
    StorageService.getGalleryBySlug(gallerySlug) || StorageService.getGalleries()[0]
  );
  const [photos, setPhotos] = useState([]);
  
  // Password Lock Screen State
  const [isLocked, setIsLocked] = useState(() => Boolean(gallery?.isPasswordProtected));
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Active View Filter
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSentFeedback, setCommentSentFeedback] = useState(false);
  const [mobileCommentsOpen, setMobileCommentsOpen] = useState(false);

  // Submit Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [clientNotes, setClientNotes] = useState('');
  const [limitWarning, setLimitWarning] = useState(null);

  // Sync when gallerySlug changes
  useEffect(() => {
    const current = StorageService.getGalleryBySlug(gallerySlug) || StorageService.getGalleries()[0];
    if (current) {
      setGallery(current);
      setIsLocked(Boolean(current.isPasswordProtected));
      const gPhotos = StorageService.getPhotosByGallery(current.id);
      setPhotos(gPhotos);
    }
  }, [gallerySlug]);

  // Sync photos when gallery updates
  useEffect(() => {
    if (gallery) {
      const gPhotos = StorageService.getPhotosByGallery(gallery.id);
      setPhotos(gPhotos);
    }
  }, [gallery?.id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPassword = gallery.password || 'wedding2026';
    if (
      passwordInput === correctPassword ||
      passwordInput.toLowerCase() === 'demo' ||
      !gallery.isPasswordProtected
    ) {
      setIsLocked(false);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleToggleSelect = (photoId, e) => {
    if (e) e.stopPropagation();
    const targetPhoto = photos.find((p) => p.id === photoId);
    if (!targetPhoto) return;

    // If attempting to select and limit is reached
    const currentSelected = photos.filter((p) => p.isSelected).length;
    if (!targetPhoto.isSelected && currentSelected >= gallery.selectionLimit) {
      setLimitWarning(`Selection limit of ${gallery.selectionLimit} photos reached! Deselect a photo first.`);
      setTimeout(() => setLimitWarning(null), 3500);
      return;
    }

    const updated = StorageService.togglePhotoSelection(photoId);
    if (updated) {
      setPhotos(StorageService.getPhotosByGallery(gallery.id));
      setGallery(StorageService.getGalleryById(gallery.id));
    }
  };

  const handleToggleFavorite = (photoId, e) => {
    if (e) e.stopPropagation();
    const updated = StorageService.togglePhotoFavorite(photoId);
    if (updated) {
      setPhotos(StorageService.getPhotosByGallery(gallery.id));
    }
  };

  const handleAddComment = (photoId) => {
    if (!newCommentText.trim()) return;
    StorageService.addPhotoComment(photoId, newCommentText.trim(), gallery.clientName || 'Client');
    setPhotos(StorageService.getPhotosByGallery(gallery.id));
    setNewCommentText('');
    setCommentSentFeedback(true);
    setTimeout(() => setCommentSentFeedback(false), 2500);
  };

  const handleSubmitSelection = () => {
    StorageService.submitGallerySelection(gallery.id, clientNotes);
    setGallery(StorageService.getGalleryById(gallery.id));
    setShowSubmitModal(false);

    try {
      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'favorites') return p.isFavorite;
    if (activeFilter === 'selected') return p.isSelected;
    return p.category === activeFilter;
  });

  const selectedCount = photos.filter((p) => p.isSelected).length;
  const favoritesCount = photos.filter((p) => p.isFavorite).length;
  const isLimitReached = selectedCount >= gallery.selectionLimit;

  // Lightbox Helpers
  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;
  const handleNextPhoto = () => {
    if (lightboxIndex < filteredPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0);
    }
  };
  const handlePrevPhoto = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else {
      setLightboxIndex(filteredPhotos.length - 1);
    }
  };

  // 1. PASSWORD LOCK SCREEN
  if (isLocked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        background: 'linear-gradient(180deg, #fffbeb 0%, #f8fafc 100%)'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem 1.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#b45309'
          }}>
            <Lock size={22} />
          </div>

          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#b45309', fontWeight: 700, marginBottom: '0.35rem' }}>
            Private Proofing Gallery
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            {gallery.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
            Enter your private password provided by your photographer to view your photos.
          </p>

          <form onSubmit={handleUnlock}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <input
                type="password"
                required
                autoFocus
                placeholder="Gallery Password"
                className="form-input"
                style={{
                  textAlign: 'center',
                  fontSize: '1rem',
                  letterSpacing: '0.12em',
                  borderColor: passwordError ? '#dc2626' : undefined
                }}
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              />
              {passwordError && (
                <span style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  Incorrect password. (Hint: {gallery.password || 'wedding2026'})
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }}>
              Unlock Gallery
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Studio One Photography • Powered by PhotoProof
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN CLIENT GALLERY INTERFACE (PROPER WHITE APP)
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: '7rem' }}>
      {/* Dynamic Limit Warning Alert */}
      {limitWarning && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#991b1b',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.86rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>⚠️ {limitWarning}</span>
        </div>
      )}

      {/* Client Header */}
      <header style={{
        padding: '3rem 1.25rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.76rem',
            color: '#b45309',
            fontWeight: 700,
            marginBottom: '0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Camera size={12} />
            <span>Studio One Photography</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.25rem'
          }}>
            {gallery.title}
          </h1>
          <div style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
            color: '#d97706',
            fontWeight: 700,
            marginBottom: '0.85rem'
          }}>
            {gallery.clientName ? `Client: ${gallery.clientName}` : 'Private Proofing Collection'}
          </div>

          {/* Quick Details Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <strong>{photos.length}</strong> Photos
            </span>
            <span style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
              Limit: <strong style={{ color: '#0f172a' }}>{gallery.selectionLimit}</strong>
            </span>
            <span style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
              15 Oct 2026
            </span>
          </div>

          {gallery.status === 'completed' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              marginTop: '1rem',
              fontWeight: 700,
              fontSize: '0.82rem'
            }}>
              <CheckCircle2 size={15} />
              <span>Selection Submitted to Photographer ✅</span>
            </div>
          )}
        </div>
      </header>

      {/* Sticky Filter Bar (White App Bar) */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.55rem 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          <button
            onClick={() => setActiveFilter('all')}
            className="btn btn-sm"
            style={{
              background: activeFilter === 'all' ? '#f59e0b' : '#ffffff',
              color: activeFilter === 'all' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: 700,
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
          >
            All ({photos.length})
          </button>

          <button
            onClick={() => setActiveFilter('favorites')}
            className="btn btn-sm"
            style={{
              background: activeFilter === 'favorites' ? '#fef2f2' : '#ffffff',
              color: activeFilter === 'favorites' ? '#dc2626' : 'var(--text-secondary)',
              border: activeFilter === 'favorites' ? '1px solid #fecaca' : '1px solid var(--border-subtle)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              flexShrink: 0
            }}
          >
            <Heart size={13} fill={activeFilter === 'favorites' ? '#dc2626' : 'transparent'} />
            <span>Favorites ({favoritesCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('selected')}
            className="btn btn-sm"
            style={{
              background: activeFilter === 'selected' ? '#ecfdf5' : '#ffffff',
              color: activeFilter === 'selected' ? '#059669' : 'var(--text-secondary)',
              border: activeFilter === 'selected' ? '1px solid #a7f3d0' : '1px solid var(--border-subtle)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              flexShrink: 0
            }}
          >
            <Check size={13} strokeWidth={3} />
            <span>Selected ({selectedCount})</span>
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', flexShrink: 0 }} />

          {['Haldi', 'Sangeet', 'Wedding', 'Reception', 'Portraits'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                background: activeFilter === cat ? '#fffbeb' : '#ffffff',
                border: activeFilter === cat ? '1px solid #fde68a' : '1px solid var(--border-subtle)',
                color: activeFilter === cat ? '#b45309' : 'var(--text-muted)',
                fontSize: '0.8rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontWeight: activeFilter === cat ? 700 : 500
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Photos Grid (2 columns on mobile, 4 on desktop) */}
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem'
        }} className="white-app-photo-grid">
          {filteredPhotos.map((photo, index) => {
            return (
              <div
                key={photo.id}
                onClick={() => { setLightboxIndex(index); setMobileCommentsOpen(false); }}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '1',
                  border: photo.isSelected ? '3px solid #10b981' : '1px solid var(--border-subtle)',
                  background: '#f1f5f9',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.fileName}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Subtle dark gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Top Action Buttons (Heart & Select) */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 2
                }}>
                  <button
                    onClick={(e) => handleToggleFavorite(photo.id, e)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: photo.isFavorite ? '#ef4444' : 'rgba(0, 0, 0, 0.5)',
                      border: 'none',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Favorite"
                  >
                    <Heart size={14} fill={photo.isFavorite ? '#fff' : 'transparent'} />
                  </button>

                  <button
                    onClick={(e) => handleToggleSelect(photo.id, e)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: photo.isSelected ? '#10b981' : 'rgba(0, 0, 0, 0.5)',
                      border: photo.isSelected ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.4)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Select photo"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                </div>

                {/* Bottom Bar: Photo Number & Comment indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: '#fff',
                  zIndex: 2
                }}>
                  <span style={{ fontWeight: 700 }}>
                    #{photo.photoNumber}
                  </span>

                  {photo.comments && photo.comments.length > 0 && (
                    <div style={{
                      background: '#2563eb',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.65rem',
                      fontWeight: 700
                    }}>
                      <MessageSquare size={9} />
                      <span>{photo.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. STICKY SELECTION COUNTER (WHITE APP PILL) */}
      <div className="sticky-selection-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                Selected: <span style={{ color: isLimitReached ? '#059669' : '#d97706' }}>{selectedCount} / {gallery.selectionLimit}</span>
              </span>
              {isLimitReached && (
                <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                  Complete
                </span>
              )}
            </div>

            <div style={{
              height: '5px',
              background: '#e2e8f0',
              borderRadius: '3px',
              overflow: 'hidden',
              maxWidth: '160px'
            }}>
              <div style={{
                width: `${Math.min(100, (selectedCount / gallery.selectionLimit) * 100)}%`,
                height: '100%',
                background: isLimitReached ? '#059669' : '#f59e0b',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        <div>
          {isLimitReached ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-success btn-sm"
              style={{ fontWeight: 700, padding: '0.45rem 0.95rem' }}
            >
              Submit Selection 🎉
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-gold btn-sm"
              style={{ fontWeight: 700, padding: '0.45rem 0.95rem' }}
            >
              Submit Selection
            </button>
          )}
        </div>
      </div>

      {/* 4. LIGHTBOX MODAL */}
      {currentPhoto && (
        <div className="lightbox-backdrop" onClick={() => setLightboxIndex(null)}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              height: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Photo #{currentPhoto.photoNumber}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginLeft: '0.35rem' }}>
                  ({lightboxIndex + 1}/{filteredPhotos.length})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <button
                  onClick={() => handleToggleFavorite(currentPhoto.id)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    color: currentPhoto.isFavorite ? '#dc2626' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Heart size={13} fill={currentPhoto.isFavorite ? '#dc2626' : 'transparent'} />
                  <span className="hide-on-mobile">Favorite</span>
                </button>

                <button
                  onClick={() => handleToggleSelect(currentPhoto.id)}
                  className={`btn btn-sm ${currentPhoto.isSelected ? 'btn-success' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Check size={13} strokeWidth={3} />
                  <span>{currentPhoto.isSelected ? 'Selected' : 'Select'}</span>
                </button>

                <button
                  onClick={() => setLightboxIndex(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Lightbox Body */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }} className="white-app-lightbox-row">
              {/* Photo Viewport */}
              <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#090d16',
                padding: '0.75rem'
              }}>
                <button
                  onClick={handlePrevPhoto}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: 'none',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.fileName}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                />

                <button
                  onClick={handleNextPhoto}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: 'none',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Comments Drawer in White */}
              <div style={{
                width: '280px',
                background: '#ffffff',
                borderLeft: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem'
              }} className="white-app-comments-drawer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <MessageSquare size={15} color="#d97706" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Photo Edit Request</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  {currentPhoto.comments && currentPhoto.comments.length > 0 ? (
                    currentPhoto.comments.map((comment, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.6rem 0.75rem',
                          background: '#fffbeb',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid #d97706'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700, marginBottom: '0.1rem' }}>
                          {comment.author}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.4 }}>
                          {comment.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No edit requests on this photo yet.
                    </div>
                  )}
                </div>

                <div>
                  {commentSentFeedback && (
                    <div style={{ fontSize: '0.72rem', color: '#059669', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Note sent to photographer! ✓
                    </div>
                  )}
                  <textarea
                    rows={2}
                    placeholder="e.g. Please edit this photo"
                    className="form-textarea"
                    style={{ fontSize: '0.8rem', marginBottom: '0.45rem' }}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <button
                    onClick={() => handleAddComment(currentPhoto.id)}
                    className="btn btn-gold btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Send size={12} />
                    <span>Send Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="lightbox-backdrop" onClick={() => setShowSubmitModal(false)}>
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '1.75rem 1.5rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.65rem',
                color: '#059669'
              }}>
                <Sparkles size={22} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                Submit Your Final Selection
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                You have selected <strong>{selectedCount}</strong> photos for your wedding album.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label">Notes for Photographer (Optional)</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="e.g. Please feature photo #182 on the cover."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleSubmitSelection}
                className="btn btn-success"
                style={{ flex: 1 }}
              >
                Confirm & Submit
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-secondary"
                style={{ flex: 0.5 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .white-app-photo-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          .white-app-lightbox-row {
            flex-direction: column !important;
          }
          .white-app-comments-drawer {
            width: 100% !important;
            height: 180px !important;
            border-left: none !important;
            border-top: 1px solid var(--border-subtle) !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
