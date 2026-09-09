import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera,
  Calendar,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export default function CreateGallery() {
  const navigate = useNavigate();
  const [createdGallery, setCreatedGallery] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Rahul & Priya Wedding',
    clientName: 'Rahul Sharma',
    clientEmail: 'rahul.sharma@example.com',
    clientPhone: '+91 98765 43210',
    eventDate: '2026-10-15',
    selectionLimit: 120,
    isPasswordProtected: true,
    password: 'wedding2026',
    allowDownload: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGallery = StorageService.createGallery(formData);
    setCreatedGallery(newGallery);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/dashboard/galleries"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.84rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          ← Back to Galleries
        </Link>
      </div>

      {createdGallery ? (
        /* Success Screen */
        <div className="glass-card" style={{
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          border: '1px solid #a7f3d0',
          background: '#ffffff'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#059669'
          }}>
            <CheckCircle2 size={34} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Gallery created successfully 🎉
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            <strong>{createdGallery.title}</strong> is ready. Now upload high-res photos to compress & deliver.
          </p>

          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'left',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            fontSize: '0.84rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Client:</span>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{createdGallery.clientName}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Selection Limit:</span>
              <div style={{ fontWeight: 700, color: '#b45309' }}>{createdGallery.selectionLimit} Photos</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Password:</span>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{createdGallery.isPasswordProtected ? createdGallery.password : 'None'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Private Link:</span>
              <div style={{ fontWeight: 700, color: '#2563eb' }}>/gallery/{createdGallery.slug}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to={`/dashboard/galleries/${createdGallery.id}`}
              className="btn btn-gold btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <UploadCloud size={16} />
              <span>Upload Photos (Smart Compression)</span>
            </Link>

            <Link
              to="/dashboard/galleries"
              className="btn btn-secondary btn-lg"
            >
              View All Galleries
            </Link>
          </div>
        </div>
      ) : (
        /* Create Form */
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309'
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Create New Gallery</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Set up a private proofing gallery and define client selection limits
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Gallery Name */}
            <div className="form-group">
              <label className="form-label">Gallery Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Rahul & Priya Wedding"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Client Name & Client Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="client@example.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                />
              </div>
            </div>

            {/* Event Date & Selection Limit */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Selection Limit</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="2000"
                  className="form-input"
                  placeholder="120"
                  value={formData.selectionLimit}
                  onChange={(e) => setFormData({ ...formData, selectionLimit: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Password Protection Toggle */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: formData.isPasswordProtected ? '0.75rem' : 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={16} color="#d97706" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Password Protection</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Require password to view this gallery</div>
                  </div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, isPasswordProtected: !formData.isPasswordProtected })}
                  style={{
                    width: '42px',
                    height: '24px',
                    background: formData.isPasswordProtected ? '#059669' : '#cbd5e1',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: formData.isPasswordProtected ? '21px' : '3px',
                    transition: 'left 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }} />
                </div>
              </div>

              {formData.isPasswordProtected && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gallery Password</label>
                  <input
                    type="text"
                    required={formData.isPasswordProtected}
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }}>
              <span>+ Create Gallery</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
