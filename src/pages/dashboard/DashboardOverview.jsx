import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Image,
  Camera,
  HardDrive,
  Zap,
  PlusCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export default function DashboardOverview() {
  const photographer = StorageService.getPhotographer();
  const galleries = StorageService.getGalleries();
  const allPhotos = StorageService.getAllPhotos();
  const [copiedSlug, setCopiedSlug] = useState(null);

  const totalPhotosCount = allPhotos.length;
  const completedGalleries = galleries.filter((g) => g.status === 'completed').length;
  const activeProofingGalleries = galleries.filter((g) => g.status !== 'completed').length;

  const handleCopyLink = (slug) => {
    const fullUrl = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Welcome Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', fontWeight: 800, color: '#0f172a' }}>
            Welcome back 👋 {photographer.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {photographer.studioName} • PRO Plan Active
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/gallery/rahul-priya-wedding" target="_blank" className="btn btn-secondary btn-sm">
            <ExternalLink size={13} />
            <span>Client Demo</span>
          </Link>
          <Link to="/dashboard/galleries/create" className="btn btn-gold btn-sm">
            <PlusCircle size={14} />
            <span>+ Create Gallery</span>
          </Link>
        </div>
      </div>

      {/* Metrics Counters (4 Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Galleries</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image size={15} color="#b45309" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{galleries.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>● {activeProofingGalleries} active</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Photos</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={15} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{totalPhotosCount.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WebP Optimized</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Selections</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={15} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{completedGalleries} / {galleries.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>Rahul Done ✅</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Storage Saved</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color="#b45309" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669' }}>38%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>~44 GB quota saved</div>
        </div>
      </div>

      {/* STORAGE USAGE CARD (SPEC: 72 GB / 100 GB, You saved 38% storage with compression) */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        marginBottom: '1.75rem',
        border: '1px solid #fed7aa',
        background: 'linear-gradient(180deg, #fffbf5 0%, #ffffff 100%)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={18} color="#b45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Storage Usage</h3>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Proofing Cloud Allocation</div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>72 GB</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / 100 GB</span>
          </div>
        </div>

        {/* Progress Bar (72%) */}
        <div style={{
          height: '9px',
          background: '#e2e8f0',
          borderRadius: '5px',
          overflow: 'hidden',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            width: '72%',
            height: '100%',
            background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
            borderRadius: '5px'
          }} />
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 700 }}>
            <Sparkles size={13} />
            <span>You saved 38% storage with compression.</span>
          </div>
          <Link to="/dashboard/billing" style={{ color: '#d97706', textDecoration: 'none', fontWeight: 600 }}>
            Manage Storage →
          </Link>
        </div>
      </div>

      {/* RECENT GALLERIES */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Recent Galleries</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              Client albums and live selection limits
            </p>
          </div>

          <Link
            to="/dashboard/galleries"
            style={{
              color: '#d97706',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {galleries.slice(0, 3).map((gallery) => {
            const isCompleted = gallery.status === 'completed';
            return (
              <div
                key={gallery.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {/* Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                      <Link
                        to={`/dashboard/galleries/${gallery.id}`}
                        style={{
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          color: '#0f172a',
                          textDecoration: 'none'
                        }}
                      >
                        {gallery.title}
                      </Link>
                      {isCompleted ? (
                        <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                          Completed
                        </span>
                      ) : (
                        <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>
                          In Progress
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {gallery.totalPhotos} Photos • Client: {gallery.clientName}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ minWidth: '140px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Selection:</span>
                    <strong style={{ color: isCompleted ? '#059669' : '#d97706' }}>
                      {gallery.selectedCount} / {gallery.selectionLimit} Photos
                    </strong>
                  </div>
                  <div style={{
                    height: '5px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (gallery.selectedCount / gallery.selectionLimit) * 100)}%`,
                      height: '100%',
                      background: isCompleted ? '#10b981' : '#f59e0b'
                    }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <button
                    onClick={() => handleCopyLink(gallery.slug)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <Copy size={12} />
                    <span>{copiedSlug === gallery.slug ? 'Copied!' : 'Copy Link'}</span>
                  </button>

                  <Link
                    to={`/gallery/${gallery.slug}`}
                    target="_blank"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <ExternalLink size={12} />
                    <span>Client View</span>
                  </Link>

                  <Link
                    to={`/dashboard/galleries/${gallery.id}`}
                    className="btn btn-gold btn-sm"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <span>Manage</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
