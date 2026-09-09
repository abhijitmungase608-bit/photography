import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storage';

export default function Settings() {
  const [photographer, setPhotographer] = useState(StorageService.getPhotographer());
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    StorageService.updatePhotographer(photographer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem' }}>Studio Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
          Configure your studio branding, watermark preferences, and studio details
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Profile */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Studio Profile</h3>

          <div className="form-group">
            <label className="form-label">Photographer Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={photographer.name}
              onChange={(e) => setPhotographer({ ...photographer, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Studio Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={photographer.studioName}
              onChange={(e) => setPhotographer({ ...photographer, studioName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={photographer.email}
                onChange={(e) => setPhotographer({ ...photographer, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone (WhatsApp)</label>
              <input
                type="text"
                required
                className="form-input"
                value={photographer.phone}
                onChange={(e) => setPhotographer({ ...photographer, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Watermarking & Branding</h3>

          <div className="form-group">
            <label className="form-label">Watermark Text</label>
            <input
              type="text"
              className="form-input"
              value={photographer.watermarkText}
              onChange={(e) => setPhotographer({ ...photographer, watermarkText: e.target.value })}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Overlaid semi-transparently on client proofing previews
            </span>
          </div>

          <div style={{
            marginTop: '0.85rem',
            padding: '1rem',
            background: '#0f172a',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
            />
            <div style={{
              position: 'absolute',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}>
              {photographer.watermarkText}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-gold btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Save size={16} />
          <span>{saved ? 'Settings Saved! ✓' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
}
