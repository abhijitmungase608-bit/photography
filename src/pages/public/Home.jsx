import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Share2, Heart, CheckCircle2, Download, Lock } from 'lucide-react';
import HeroGalleryMockup from '../../components/home/HeroGalleryMockup';
import SmartCompressionCard from '../../components/home/SmartCompressionCard';

export default function Home() {
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        padding: 'clamp(3rem, 6vw, 5.5rem) 0 clamp(2.5rem, 5vw, 4.5rem)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'center'
        }}>
          {/* Left Hero Content */}
          <div style={{ maxWidth: '580px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              color: '#f59e0b',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={13} />
              <span>Built for High-Volume Event Photographers</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Your Photos.<br />
              <span className="gold-gradient-text">Your Selection.</span><br />
              Simplified.
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              Upload your event photos, share a private gallery, and let your clients select their favorites effortlessly.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              alignItems: 'center'
            }}>
              <Link
                to="/dashboard/galleries/create"
                className="btn btn-gold btn-lg"
                style={{ flex: '1 1 auto', maxWidth: '240px' }}
              >
                <span>Create Free Gallery</span>
              </Link>

              <Link
                to="/gallery/rahul-priya-wedding"
                className="btn btn-secondary btn-lg"
                style={{ flex: '1 1 auto', maxWidth: '220px' }}
              >
                <span>View Demo</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Proofing Highlights */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginTop: '2.25rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={15} color="#10b981" />
                <span>Password Protected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={15} color="#f59e0b" />
                <span>88% Compression</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Share2 size={15} color="#60a5fa" />
                <span>1-Click WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Mockup */}
          <div style={{ width: '100%' }}>
            <HeroGalleryMockup />
          </div>
        </div>
      </section>

      {/* 2. SMART COMPRESSION SECTION */}
      <section style={{ padding: '2rem 0 clamp(3rem, 5vw, 5rem)' }}>
        <div className="container">
          <SmartCompressionCard />
        </div>
      </section>

      {/* 3. WORKFLOW STEPS */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4.5rem) 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              Workflow
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', marginBottom: '0.5rem' }}>
              How PhotoProof Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              From RAW camera roll to final album delivery in 4 clean steps.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '1.25rem'
          }}>
            {[
              {
                step: '01',
                title: 'Upload with Compression',
                desc: 'Upload hundreds of photos. Smart in-browser WebP downscales to 2000px without wasting storage.',
                icon: Zap,
                color: '#f59e0b'
              },
              {
                step: '02',
                title: 'Share Private Link',
                desc: 'Send a private password-protected link directly on WhatsApp with pre-formatted greeting.',
                icon: Share2,
                color: '#10b981'
              },
              {
                step: '03',
                title: 'Client Selects Favorites',
                desc: 'Clients tap hearts & checkboxes on mobile. Sticky counter prevents going over package limit.',
                icon: Heart,
                color: '#ec4899'
              },
              {
                step: '04',
                title: 'Export to Lightroom',
                desc: 'Download clean selection filenames or CSV with one click. Ready for final retouching.',
                icon: Download,
                color: '#6366f1'
              }
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.step} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={20} color={item.color} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: 'var(--text-subtle)'
                    }}>
                      {item.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BOTTOM BANNER */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(13, 17, 26, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', marginBottom: '0.75rem' }}>
              Upgrade Your Client Delivery Today
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
              Save up to 88% cloud storage and simplify photo proofing for you and your clients.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard/galleries/create" className="btn btn-gold btn-lg">
                Create Free Gallery
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                Open Dashboard Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
