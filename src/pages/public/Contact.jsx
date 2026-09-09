import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studioName: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            We're Here to Help
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
            Get in Touch with <span className="gold-gradient-text">PhotoProof</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Have questions about smart compression or want custom studio onboarding? Reach out anytime.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Left: Contact Info */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Contact Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Mail size={20} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Us</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>support@photoproof.in</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageCircle size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp Support</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>+91 98765 43210</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin size={20} color="#6366f1" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Headquarters</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Bengaluru & Mumbai, India</div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              ⚡ Average response time: <strong>under 20 minutes</strong> during Indian business hours.
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <CheckCircle2 size={36} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Message Received!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Thank you for contacting PhotoProof. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Send Us a Message</h3>

                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhi Sharma"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="abhi@studioone.in"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Studio Name / City</label>
                  <input
                    type="text"
                    placeholder="Studio One Photography, Mumbai"
                    className="form-input"
                    value={formData.studioName}
                    onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Inquiries</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your requirements or questions..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Send size={16} />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
