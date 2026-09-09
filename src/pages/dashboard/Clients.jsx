import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, ExternalLink, CheckCircle2, Search, Share2, Calendar } from 'lucide-react';
import { StorageService } from '../../services/storage';

export default function Clients() {
  const galleries = StorageService.getGalleries();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const clients = galleries.map((g) => ({
    id: g.id,
    name: g.clientName || 'Valued Client',
    email: g.clientEmail || 'client@example.com',
    phone: g.clientPhone || '+91 98765 43210',
    event: g.title,
    eventDate: g.eventDate || g.createdAt,
    gallerySlug: g.slug,
    status: g.status === 'completed' ? 'Selection Completed' : 'In Progress',
    selected: g.selectedCount || 0,
    limit: g.selectionLimit || 100
  }));

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && c.status === 'Selection Completed') ||
      (filterStatus === 'active' && c.status !== 'Selection Completed');
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.85rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
          Clients
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
          Directory of client events, proofing links, and live selection tracking
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.65rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '380px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search client or event..."
            className="form-input"
            style={{ paddingLeft: '2.25rem', fontSize: '0.84rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[
            { id: 'all', label: `All (${clients.length})` },
            { id: 'active', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className="btn btn-sm"
              style={{
                background: filterStatus === tab.id ? '#f59e0b' : '#ffffff',
                color: filterStatus === tab.id ? '#0f172a' : 'var(--text-secondary)',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. NATIVE MOBILE APP CARD VIEW (Visible on mobile screens < 768px) */}
      <div className="clients-mobile-card-list">
        {filteredClients.map((client) => {
          const isCompleted = client.status === 'Selection Completed';
          const percent = Math.min(100, Math.round((client.selected / client.limit) * 100));

          return (
            <div
              key={client.id}
              className="glass-card"
              style={{
                padding: '1.15rem',
                marginBottom: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {/* Header: Name + Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem' }}>
                    {client.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {client.email}
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="badge badge-success" style={{ fontSize: '0.66rem' }}>
                      Completed ✅
                    </span>
                  ) : (
                    <span className="badge badge-gold" style={{ fontSize: '0.66rem' }}>
                      In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Event Details Box */}
              <div style={{
                background: '#f8fafc',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                  {client.event}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  📅 Event Date: {client.eventDate}
                </div>
              </div>

              {/* Selection Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Selection Progress</span>
                  <strong style={{ color: isCompleted ? '#059669' : '#d97706' }}>
                    {client.selected} / {client.limit} Photos ({percent}%)
                  </strong>
                </div>
                <div style={{
                  height: '7px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: isCompleted ? '#10b981' : '#f59e0b',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <Link
                  to={`/gallery/${client.gallerySlug}`}
                  target="_blank"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.55rem' }}
                >
                  <ExternalLink size={13} />
                  <span>Client View</span>
                </Link>

                <a
                  href={`https://api.whatsapp.com/send?phone=${client.phone.replace(/[^0-9]/g, '')}&text=Hi%20${encodeURIComponent(client.name)},%20your%20proofing%20gallery%20is%20ready!`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success btn-sm"
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.55rem' }}
                >
                  <Share2 size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. DESKTOP TABLE VIEW (Visible on desktop screens >= 768px) */}
      <div className="clients-desktop-table glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <th style={{ padding: '0.75rem 0.85rem' }}>Client</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Event</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Selection Progress</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Status</th>
              <th style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => {
              const isCompleted = client.status === 'Selection Completed';
              const percent = Math.min(100, Math.round((client.selected / client.limit) * 100));
              return (
                <tr
                  key={client.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '0.86rem'
                  }}
                >
                  <td style={{ padding: '1rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{client.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{client.email}</div>
                  </td>
                  <td style={{ padding: '1rem 0.85rem' }}>
                    <div style={{ color: '#0f172a', fontWeight: 600 }}>{client.event}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{client.eventDate}</div>
                  </td>
                  <td style={{ padding: '1rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: isCompleted ? '#059669' : '#d97706', marginBottom: '0.2rem' }}>
                      {client.selected} / {client.limit} Photos
                    </div>
                    <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', width: '120px' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: isCompleted ? '#10b981' : '#f59e0b' }} />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.85rem' }}>
                    {isCompleted ? (
                      <span className="badge badge-success">Completed</span>
                    ) : (
                      <span className="badge badge-gold">In Progress</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.85rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <Link
                        to={`/gallery/${client.gallerySlug}`}
                        target="_blank"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <ExternalLink size={12} />
                        <span>Client View</span>
                      </Link>
                      <a
                        href={`https://api.whatsapp.com/send?phone=${client.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .clients-mobile-card-list {
          display: none;
        }
        .clients-desktop-table {
          display: block;
        }
        @media (max-width: 768px) {
          .clients-mobile-card-list {
            display: block !important;
          }
          .clients-desktop-table {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
