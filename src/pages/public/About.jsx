import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Users, Zap, Shield, Sparkles, Heart } from 'lucide-react';

export default function About() {
  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        {/* Story Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Our Mission
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', marginBottom: '1.25rem' }}>
            Empowering Event Photographers to <span className="gold-gradient-text">Deliver Magic</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.7 }}>
            PhotoProof was born from a real problem every Indian wedding & event photographer faces: uploading 3,000 heavy RAW photos, watching cloud storage bills explode, and chasing clients for weeks on WhatsApp for album selections.
          </p>
        </div>

        {/* Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Zap size={24} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Smart In-Browser Tech</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Why upload an 8.2 MB file when 950 KB looks identical on retina screens? We engineered browser-side WebP compression that cuts up to 88% of unnecessary weight.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Heart size={24} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Joyful Client Proofing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Clients love our frictionless mobile experience. Tap heart for favorites, tap check for album selections, and comment "Please edit this photo" directly on the image.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Shield size={24} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Studio-Grade Security</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Strict client isolation ensures clients only see their own photos with zero access to your photographer control center or other couples' private memories.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card" style={{
          padding: '3rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
        }}>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
              88%
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Average Storage Saved
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
              15,000+
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Galleries Delivered
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-heading)' }}>
              4.9/5
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Photographer Rating
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-heading)' }}>
              ₹0
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Free to Get Started
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
