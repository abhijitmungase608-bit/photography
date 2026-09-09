import React from 'react';
import { Heart, CheckCircle2, MessageSquare, Shield, Check } from 'lucide-react';

export default function HeroGalleryMockup() {
  const mockupPhotos = [
    {
      id: 1,
      title: 'Sindoor Ceremony',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      selected: true,
      favorite: true
    },
    {
      id: 2,
      title: 'Bridal Portrait',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      selected: true,
      favorite: false
    },
    {
      id: 3,
      title: 'Varmala Celebration',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      selected: false,
      favorite: true
    },
    {
      id: 4,
      title: 'Reception Walk',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      selected: true,
      favorite: false
    }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {/* Clean Glassmorphic Frame */}
      <div className="glass-card" style={{
        padding: '1rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Mockup Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.75rem',
          marginBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.4rem', fontWeight: 600 }}>
              Rahul & Priya • Wedding Proofing
            </span>
          </div>

          <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
            Private Link
          </span>
        </div>

        {/* 2x2 Photo Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem'
        }}>
          {mockupPhotos.map((photo) => (
            <div
              key={photo.id}
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                border: photo.selected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <img
                src={photo.url}
                alt={photo.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%)'
              }} />

              {/* Status Badges */}
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                display: 'flex',
                gap: '0.3rem'
              }}>
                {photo.favorite && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Heart size={12} color="#fff" fill="#fff" />
                  </div>
                )}
                {photo.selected && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Caption */}
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '8px',
                right: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: '#fff',
                fontWeight: 600
              }}>
                <span>{photo.title}</span>
                <span style={{ color: '#34d399' }}>950 KB</span>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Bottom Proofing Info */}
        <div style={{
          marginTop: '0.85rem',
          padding: '0.65rem 0.85rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Selection:</span>
            <strong style={{ color: '#f59e0b' }}>87 / 120 Photos</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#818cf8' }}>
            <MessageSquare size={13} />
            <span>Photo #182: "Please edit this"</span>
          </div>
        </div>
      </div>
    </div>
  );
}
