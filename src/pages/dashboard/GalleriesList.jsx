import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ExternalLink,
  Copy,
  Trash2,
  Lock
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export default function GalleriesList() {
  const [galleries, setGalleries] = useState(StorageService.getGalleries());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [copiedSlug, setCopiedSlug] = useState(null);

  const handleCopyLink = (slug) => {
    const fullUrl = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      StorageService.deleteGallery(id);
      setGalleries(StorageService.getGalleries());
    }
  };

  const filtered = galleries.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || g.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem' }}>Galleries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Manage client albums, track selections, and copy WhatsApp links
          </p>
        </div>

        <Link to="/dashboard/galleries/create" className="btn btn-gold btn-sm">
          <PlusCircle size={14} />
          <span>+ Create Gallery</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '380px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search galleries or clients..."
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['all', 'active', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className="btn btn-sm"
              style={{
                background: filterStatus === st ? '#f59e0b' : '#ffffff',
                color: filterStatus === st ? '#0f172a' : 'var(--text-secondary)',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                textTransform: 'capitalize'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {filtered.map((gallery) => {
          const isCompleted = gallery.status === 'completed';
          return (
            <div
              key={gallery.id}
              className="glass-card"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', height: '160px' }}>
                <img
                  src={gallery.coverImage}
                  alt={gallery.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.35rem' }}>
                  {gallery.isPasswordProtected && (
                    <div style={{
                      background: '#ffffff',
                      boxShadow: 'var(--shadow-sm)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontWeight: 700
                    }}>
                      <Lock size={10} color="#d97706" />
                      <span>Protected</span>
                    </div>
                  )}

                  {isCompleted ? (
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Completed</span>
                  ) : (
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>In Progress</span>
                  )}
                </div>
              </div>

              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                    {gallery.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Client: {gallery.clientName} • {gallery.totalPhotos} Photos
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Selection:</span>
                      <strong style={{ color: isCompleted ? '#059669' : '#d97706' }}>
                        {gallery.selectedCount} / {gallery.selectionLimit} Photos
                      </strong>
                    </div>
                    <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (gallery.selectedCount / gallery.selectionLimit) * 100)}%`, height: '100%', background: isCompleted ? '#10b981' : '#f59e0b' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link to={`/dashboard/galleries/${gallery.id}`} className="btn btn-gold btn-sm" style={{ flex: 1, fontSize: '0.78rem' }}>
                    Manage
                  </Link>
                  <button onClick={() => handleCopyLink(gallery.slug)} className="btn btn-secondary btn-sm" title="Copy Link" style={{ fontSize: '0.78rem' }}>
                    <Copy size={12} />
                    <span>{copiedSlug === gallery.slug ? '✓' : ''}</span>
                  </button>
                  <Link to={`/gallery/${gallery.slug}`} target="_blank" className="btn btn-secondary btn-sm" title="Client View" style={{ fontSize: '0.78rem' }}>
                    <ExternalLink size={12} />
                  </Link>
                  <button onClick={() => handleDelete(gallery.id, gallery.title)} className="btn btn-secondary btn-sm" title="Delete" style={{ color: '#dc2626' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
