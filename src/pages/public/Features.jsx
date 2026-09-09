import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Share2, Smartphone, Download, CheckSquare, Sparkles, Clock, Layers, ArrowRight } from 'lucide-react';
import SmartCompressionCard from '../../components/home/SmartCompressionCard';

export default function Features() {
  const featureList = [
    {
      icon: Zap,
      color: '#f59e0b',
      title: 'Smart In-Browser Compression',
      desc: 'Automatic downsampling to max 2000px and WebP conversion right inside your browser before upload. An 8.2 MB RAW photo drops to ~950 KB with zero visible loss.'
    },
    {
      icon: Shield,
      color: '#10b981',
      title: 'Bulletproof Gallery Security',
      desc: 'Unique gallery URLs, optional custom passwords, protected asset URLs, and strict client isolation. Clients cannot access photographer dashboard or settings.'
    },
    {
      icon: CheckSquare,
      color: '#6366f1',
      title: 'Smart Selection Limiter',
      desc: 'Limit client selections to exact package limits (e.g. 120 photos). Sticky counter tracks progress in real-time and enables submission only when complete.'
    },
    {
      icon: Share2,
      color: '#22c55e',
      title: '1-Click WhatsApp Sharing',
      desc: 'Generate pre-formatted WhatsApp invites with custom greetings, private link, and password. Send directly to brides, grooms, or corporate event hosts.'
    },
    {
      icon: Smartphone,
      color: '#ec4899',
      title: 'Ultra-Fast Mobile Proofing',
      desc: 'Galleries are optimized with 400px progressive thumbnails and high-res WebP lightboxes so clients on mobile devices can proof seamlessly even on 4G connections.'
    },
    {
      icon: Download,
      color: '#3b82f6',
      title: 'Instant Lightroom Selection Export',
      desc: 'Once the client submits their 120 selections, export clean filename lists, CSVs, or Lightroom search queries with one click. No more typing filenames manually.'
    }
  ];

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Built for High-Volume Photographers
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
            Features Engineered for <span className="gold-gradient-text">Zero Friction</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Eliminate endless WhatsApp back-and-forth, cut expensive cloud storage bills by up to 88%, and deliver memorable gallery experiences.
          </p>
        </div>

        {/* Smart Compression Highlight */}
        <div style={{ marginBottom: '5rem' }}>
          <SmartCompressionCard />
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {featureList.map((f, i) => {
            const IconComp = f.icon;
            return (
              <div key={i} className="glass-card" style={{ padding: '2.25rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <IconComp size={26} color={f.color} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="glass-card" style={{
          padding: '3rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Experience the Difference Live</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Check out our preloaded wedding demo with 500 photos and 120 selections.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/gallery/rahul-priya-wedding" className="btn btn-gold btn-lg">
              Open Client Gallery Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
