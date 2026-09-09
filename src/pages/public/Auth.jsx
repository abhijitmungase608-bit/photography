import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Camera, Lock, Mail, Sparkles, ArrowRight, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(location.pathname.includes('register'));
  const [email, setEmail] = useState('abhi@studioone.in');
  const [password, setPassword] = useState('••••••••');
  const [studioName, setStudioName] = useState('Studio One Photography');

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Clean Header Bar */}
        <div style={{
          padding: '2.5rem 2rem 1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
          borderBottom: '1px solid #fef3c7'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#0f172a',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <Camera size={26} strokeWidth={2.5} />
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.25rem'
          }}>
            Photo<span style={{ color: '#d97706' }}>Proof</span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Smart Photography Proofing & Compression Studio
          </p>
        </div>

        {/* Body Form */}
        <div style={{ padding: '2rem' }}>
          {/* 1-Click Instant Login as Abhi */}
          <button
            onClick={() => handleLogin()}
            className="btn btn-gold"
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1.5rem',
              fontSize: '0.92rem',
              fontWeight: 700
            }}
          >
            <Sparkles size={16} />
            <span>⚡ Instant Login as Abhi (Studio One)</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.74rem',
            color: 'var(--text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleLogin}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Studio Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="e.g. Pixel Stories Mumbai"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {!isRegister && (
                  <span style={{ fontSize: '0.74rem', color: '#d97706', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.7rem', fontWeight: 700 }}
            >
              <span>{isRegister ? 'Register Studio' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Toggle */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            {isRegister ? (
              <div>
                Already have an account?{' '}
                <span
                  onClick={() => setIsRegister(false)}
                  style={{ color: '#d97706', cursor: 'pointer', fontWeight: 700 }}
                >
                  Sign In
                </span>
              </div>
            ) : (
              <div>
                New photographer?{' '}
                <span
                  onClick={() => setIsRegister(true)}
                  style={{ color: '#d97706', cursor: 'pointer', fontWeight: 700 }}
                >
                  Create Studio Account
                </span>
              </div>
            )}
          </div>

          {/* Client Portal Link */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link
              to="/gallery/rahul-priya-wedding"
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Are you a client?</span>
              <strong style={{ color: '#d97706' }}>Open Rahul & Priya Wedding Demo →</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
