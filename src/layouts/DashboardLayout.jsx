import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Users,
  CreditCard,
  Settings,
  PlusCircle,
  ExternalLink,
  LogOut,
  Camera,
  HardDrive,
  Zap
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const photographer = StorageService.getPhotographer();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Galleries', path: '/dashboard/galleries', icon: Image },
    { name: 'Clients', path: '/dashboard/clients', icon: Users },
    { name: 'Billing', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Desktop App Sidebar */}
      <aside style={{
        width: '240px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-sm)'
      }} className="desktop-app-sidebar">
        {/* Brand */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'var(--text-main)'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
            }}>
              <Camera size={18} strokeWidth={2.5} />
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              Photo<span style={{ color: '#d97706' }}>Proof</span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <div style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#b45309' : 'var(--text-secondary)',
                  background: isActive ? '#fef3c7' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <IconComp size={17} color={isActive ? '#b45309' : 'var(--text-muted)'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Mini Storage Widget in Sidebar */}
        <div style={{
          padding: '0.85rem',
          margin: '0 0.75rem 1rem',
          background: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Storage</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>
              {photographer.storageUsedGb} / {photographer.storageLimitGb} GB
            </span>
          </div>

          <div style={{
            height: '5px',
            background: '#e2e8f0',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '0.4rem'
          }}>
            <div style={{
              width: `${(photographer.storageUsedGb / photographer.storageLimitGb) * 100}%`,
              height: '100%',
              background: '#f59e0b',
              borderRadius: '3px'
            }} />
          </div>

          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Zap size={10} />
            <span>38% saved by compression</span>
          </div>
        </div>

        {/* User Footer */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{photographer.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{photographer.studioName}</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            title="Sign out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main App Content Viewport */}
      <div style={{
        flex: 1,
        marginLeft: '240px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }} className="main-content-viewport">
        {/* Top App Header */}
        <header style={{
          height: '56px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(0.85rem, 2vw, 1.5rem)',
          position: 'sticky',
          top: 0,
          zIndex: 800,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
            <span className="hide-on-phone" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Studio:</span>
            <strong style={{ fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {photographer.studioName}
            </strong>
            <span className="badge badge-gold" style={{ fontSize: '0.62rem', flexShrink: 0 }}>
              PRO
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            <Link
              to="/gallery/rahul-priya-wedding"
              target="_blank"
              className="btn btn-secondary btn-sm hide-on-phone"
              style={{ fontSize: '0.78rem' }}
            >
              <ExternalLink size={13} />
              <span>Client Demo</span>
            </Link>

            <Link
              to="/dashboard/galleries/create"
              className="btn btn-gold btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
            >
              <PlusCircle size={14} />
              <span className="hide-on-phone">+ Create Gallery</span>
              <span className="show-on-phone-inline">+ Gallery</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: 'clamp(0.85rem, 2.5vw, 1.75rem)', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {/* NATIVE APP MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-app-bottom-bar">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`mobile-app-nav-item ${isActive ? 'active' : ''}`}
            >
              <IconComp size={19} color={isActive ? '#d97706' : '#64748b'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .show-on-phone-inline {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-app-sidebar {
            display: none !important;
          }
          .main-content-viewport {
            margin-left: 0 !important;
          }
          .hide-on-phone {
            display: none !important;
          }
          .show-on-phone-inline {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
}
