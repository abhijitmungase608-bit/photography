import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(9, 11, 16, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px'
      }}>
        {/* Brand */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          color: 'var(--text-main)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#090b10'
          }}>
            <Camera size={20} strokeWidth={2.5} />
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            fontWeight: 800,
            letterSpacing: '-0.025em'
          }}>
            Photo<span className="gold-gradient-text">Proof</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.75rem'
        }} className="desktop-nav-items">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#f59e0b' : 'var(--text-muted)',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            to="/dashboard"
            className="btn btn-secondary btn-sm hide-on-phone"
            style={{ fontSize: '0.82rem' }}
          >
            Dashboard
          </Link>

          <Link
            to="/gallery/rahul-priya-wedding"
            className="btn btn-gold btn-sm"
            style={{ fontSize: '0.82rem' }}
          >
            View Demo
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'none',
              padding: '0.35rem'
            }}
            className="mobile-hamburger-nav"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0d111a',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '1rem',
                color: location.pathname === link.path ? '#f59e0b' : 'var(--text-main)',
                fontWeight: 600,
                padding: '0.4rem 0'
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{
            display: 'flex',
            gap: '0.65rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.88rem' }}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/galleries/create"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-gold"
              style={{ flex: 1, fontSize: '0.88rem' }}
            >
              Create Gallery
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-nav-items { display: flex !important; }
          .mobile-hamburger-nav { display: none !important; }
        }
        @media (max-width: 819px) {
          .mobile-hamburger-nav { display: inline-flex !important; }
        }
        @media (max-width: 520px) {
          .hide-on-phone { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
