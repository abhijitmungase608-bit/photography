import React, { useState } from 'react';
import { Zap, Sparkles, Upload, FileImage, CheckCircle2 } from 'lucide-react';
import { compressImageFile, formatBytes } from '../../utils/compression';

export default function SmartCompressionCard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoResult, setDemoResult] = useState({
    originalSize: 8.2 * 1024 * 1024,
    compressedSize: 950 * 1024,
    savedPercent: 88,
    fileName: 'DSC_4892_RAW.CR3'
  });

  const handleRealFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const res = await compressImageFile(file, { preset: 'balanced' });
      setDemoResult({
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        savedPercent: res.savedPercent,
        fileName: res.fileName,
        previewUrl: res.url
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card" style={{
      padding: 'clamp(1.5rem, 3vw, 2.5rem)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      background: 'linear-gradient(180deg, rgba(18, 24, 38, 0.8) 0%, rgba(13, 17, 26, 0.9) 100%)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span className="badge badge-gold">
          Smart In-Browser Engine
        </span>
      </div>

      <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.4rem' }}>
        Upload Less. <span className="gold-gradient-text">Store More.</span>
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '580px', marginBottom: '1.75rem' }}>
        Automatically compress large camera photos during upload while maintaining pristine visual quality.
      </p>

      {/* Visual Compression Flow */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        alignItems: 'center',
        background: 'rgba(9, 12, 18, 0.85)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem'
      }}>
        {/* Step 1: Original */}
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
            Original Image
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#f87171' }}>
            {formatBytes(demoResult.originalSize)}
          </div>
          <div style={{
            height: '8px',
            width: '100%',
            background: '#ef4444',
            borderRadius: '4px',
            marginTop: '0.5rem'
          }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Heavy RAW / Full-Res JPEG
          </div>
        </div>

        {/* Step 2: Middle Pipeline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.5rem'
        }}>
          <div style={{
            padding: '0.45rem 1rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Sparkles size={14} />
            <span>Smart Compression</span>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginTop: '0.25rem'
          }}>
            ~{demoResult.savedPercent}% Storage Saved 🎉
          </div>
        </div>

        {/* Step 3: Optimized */}
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
            Web Optimized
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#34d399' }}>
            {formatBytes(demoResult.compressedSize)}
          </div>
          <div style={{
            height: '8px',
            width: `${Math.max(14, 100 - demoResult.savedPercent)}%`,
            background: '#10b981',
            borderRadius: '4px',
            marginTop: '0.5rem',
            marginRight: 'auto'
          }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Fast WebP Proofing
          </div>
        </div>
      </div>

      {/* Test your own photo banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
        padding: '1rem 1.25rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Upload size={16} color="#f59e0b" />
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600 }}>Test with your own photo: </span>
            <span style={{ color: 'var(--text-muted)' }}>Try dropping any 5MB–20MB JPEG/RAW file</span>
          </div>
        </div>

        <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleRealFile}
            style={{ display: 'none' }}
          />
          <span>{isProcessing ? 'Optimizing...' : 'Select File to Test'}</span>
        </label>
      </div>
    </div>
  );
}
