import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: '₹0',
      period: 'forever',
      description: 'Ideal for trying out PhotoProof for your next shoot',
      features: [
        '1 Active Gallery',
        'Limited Storage (2 GB)',
        'Smart Image Compression',
        'Standard Watermark',
        'Direct Link Sharing'
      ],
      ctaText: 'Get Started Free',
      ctaClass: 'btn-secondary',
      popular: false
    },
    {
      id: 'starter',
      name: 'STARTER',
      price: billingPeriod === 'monthly' ? '₹199' : '₹169',
      period: '/month',
      description: 'Great for freelance event & portrait photographers',
      features: [
        '10 Active Galleries',
        '20 GB High-Speed Storage',
        'Smart WebP Compression (~88% saved)',
        'Client Selection Limiter (e.g. 120 photos)',
        'Password Protected Links',
        'Per-Photo Client Comments',
        'Lightroom CSV Export'
      ],
      ctaText: 'Choose Starter',
      ctaClass: 'btn-secondary',
      popular: false
    },
    {
      id: 'pro',
      name: 'PRO',
      price: billingPeriod === 'monthly' ? '₹499' : '₹399',
      period: '/month',
      description: 'The standard choice for busy wedding & event studios',
      features: [
        '50 Active Galleries',
        '100 GB High-Speed Storage',
        'Smart WebP Compression (~88% saved)',
        'Custom Studio Branding & Logo',
        'Custom Watermarks',
        'WhatsApp 1-Click Client Invites',
        'Priority Proofing CDN Speed',
        'Direct Selection Downloads (ZIP + CSV)'
      ],
      ctaText: 'Start 14-Day Free Pro',
      ctaClass: 'btn-gold',
      popular: true
    },
    {
      id: 'studio',
      name: 'STUDIO',
      price: billingPeriod === 'monthly' ? '₹999' : '₹849',
      period: '/month',
      description: 'For multi-photographer production agencies & studios',
      features: [
        'Large Gallery Allowance (Unlimited)',
        '250 GB High-Speed Storage',
        'All Pro Features Included',
        'Multi-User Team Management',
        'Custom Domain (gallery.yourstudio.com)',
        'Dedicated VIP Account Manager',
        '24/7 Priority WhatsApp Support'
      ],
      ctaText: 'Upgrade to Studio',
      ctaClass: 'btn-secondary',
      popular: false
    }
  ];

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Simple, Transparent Pricing
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
            Choose the Perfect Plan for <span className="gold-gradient-text">Your Studio</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Save hours on client proofing and eliminate expensive cloud storage bills with smart compression.
          </p>

          {/* Billing Switcher */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-full)',
            marginTop: '2rem'
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: billingPeriod === 'monthly' ? '#f59e0b' : 'transparent',
                color: billingPeriod === 'monthly' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: billingPeriod === 'yearly' ? '#f59e0b' : 'transparent',
                color: billingPeriod === 'yearly' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Yearly Billing</span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                fontSize: '0.72rem',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px'
              }}>Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch',
          marginBottom: '5rem'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="glass-card"
              style={{
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.popular ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                background: plan.popular ? 'rgba(23, 34, 57, 0.9)' : 'var(--bg-card)',
                boxShadow: plan.popular ? '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.2)' : 'none'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#000',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0.35rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Sparkles size={13} color="#000" />
                  <span>Most Popular</span>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
                  {plan.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', minHeight: '38px' }}>
                  {plan.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  {plan.price}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {plan.period}
                </span>
              </div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem', flex: 1 }}>
                {plan.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.88rem' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      <Check size={12} color="#10b981" strokeWidth={3} />
                    </div>
                    <span style={{ color: 'var(--text-main)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedPlanModal(plan)}
                className={`btn ${plan.ctaClass}`}
                style={{ width: '100%' }}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                q: 'How does Smart Compression save storage?',
                a: 'Photos are analyzed and downsampled right inside your browser to 2000px maximum resolution and converted to modern WebP format before upload. This cuts file size by up to 88% while preserving exceptional clarity for client proofing.'
              },
              {
                q: 'Can clients access my photographer dashboard?',
                a: 'Absolutely not. Clients only have access to their own private gallery URL (e.g. /gallery/rahul-priya-wedding) protected by an optional password. All dashboard, analytics, and billing pages are strictly segregated.'
              },
              {
                q: 'How do I export selections into Adobe Lightroom?',
                a: 'From your gallery dashboard, simply click "Download Selection List" to get a comma-separated list of filenames (e.g. IMG_8182.RAW, IMG_8183.RAW) that you can paste directly into Lightroom Library Filter bar.'
              },
              {
                q: 'Payment gateway integration details?',
                a: 'We currently offer full demo testing for all tiers. Live payment gateway integration (Razorpay / Stripe) will be connected soon.'
              }
            ].map((faq, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem 1.75rem' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: '#f59e0b' }}>
                  {faq.q}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Plan Selection */}
        {selectedPlanModal && (
          <div className="lightbox-backdrop" onClick={() => setSelectedPlanModal(null)}>
            <div
              className="glass-card"
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: '2.5rem',
                background: 'var(--bg-card-solid)',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <Sparkles size={28} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {selectedPlanModal.name} Plan
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Selected price: <strong style={{ color: '#fff' }}>{selectedPlanModal.price} {selectedPlanModal.period}</strong>
              </p>
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '1.75rem',
                border: '1px dashed var(--border-subtle)'
              }}>
                ℹ️ <strong>Note:</strong> Payment gateway integration is scheduled for production release. Your account has been upgraded in full demo mode!
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/dashboard"
                  className="btn btn-gold"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedPlanModal(null)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => setSelectedPlanModal(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
