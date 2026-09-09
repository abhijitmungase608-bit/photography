import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, Zap, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(5, 8, 15, 0.95)',
      padding: '4rem 0 2.5rem',
      marginTop: '5rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Camera size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
                Photo<span className="gold-gradient-text">Proof</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              The all-in-one proofing, selection, and smart compression platform built for wedding and event photographers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
              <Zap size={14} color="#f59e0b" />
              <span>Saves up to 88% cloud storage cost</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)', marginBottom: '1.2rem' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Smart Compression</Link>
              <Link to="/gallery/rahul-priya-wedding" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Client Gallery Demo</Link>
              <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Photographer Dashboard</Link>
              <Link to="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing & Plans</Link>
              <Link to="/dashboard/galleries/create" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Create Gallery</Link>
            </div>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)', marginBottom: '1.2rem' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About PhotoProof</Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & Support</Link>
              <span style={{ color: 'var(--text-muted)' }}>Made for Indian Photographers</span>
              <span style={{ color: 'var(--text-muted)' }}>Security & Privacy</span>
            </div>
          </div>

          {/* Col 4: Support & Security */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)', marginBottom: '1.2rem' }}>
              Security
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} color="#10b981" />
                <span>Password Protected Galleries</span>
              </div>
              <div>End-to-end client proof isolation</div>
              <div>Watermarking protection</div>
              <div>Direct WhatsApp link delivery</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            © {new Date().getFullYear()} PhotoProof Technologies. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ec4899" fill="#ec4899" /> for creative storytellers.
          </div>
        </div>
      </div>
    </footer>
  );
}
