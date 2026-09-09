import React, { useState } from 'react';
import {
  CreditCard,
  HardDrive,
  Zap,
  Check,
  Sparkles,
  Download,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Smartphone,
  Copy,
  Edit2,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';

export default function Billing() {
  const [photographer, setPhotographer] = useState(() => StorageService.getPhotographer());
  const [invoices, setInvoices] = useState(() => StorageService.getInvoices());
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [successBanner, setSuccessBanner] = useState(null);
  const [receiptToast, setReceiptToast] = useState(null);

  // User's custom payment method states
  const upiNumber = photographer.upiNumber || '80109471110';
  const upiId = photographer.upiId || '80109471110@upi';
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [tempUpiInput, setTempUpiInput] = useState(upiNumber);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const plans = [
    {
      name: 'FREE',
      price: '₹0',
      period: 'forever',
      galleries: '1 Gallery',
      storage: '2 GB Cloud Storage',
      storageLimitGb: 2,
      features: [
        'Smart Image Compression',
        'Standard client proofing',
        'Direct link sharing',
        'Basic selection counter'
      ]
    },
    {
      name: 'STARTER',
      price: '₹199',
      period: '/month',
      galleries: '10 Galleries',
      storage: '20 GB Storage',
      storageLimitGb: 20,
      features: [
        'Client Selection Limiter',
        'Password Protection',
        'Lightroom CSV Export',
        'Direct ZIP Downloads'
      ]
    },
    {
      name: 'PRO',
      price: '₹499',
      period: '/month',
      galleries: '50 Galleries',
      storage: '100 GB Storage',
      storageLimitGb: 100,
      popular: true,
      features: [
        'Custom Studio Branding & Watermark',
        'WhatsApp 1-Click Client Invites',
        'Photo #182 Retouch Comments Feed',
        'Priority High-Speed WebP CDN'
      ]
    },
    {
      name: 'STUDIO',
      price: '₹999',
      period: '/month',
      galleries: 'Unlimited Galleries',
      storage: '250 GB Storage',
      storageLimitGb: 250,
      features: [
        'Custom Domain Support',
        'Multi-photographer team access',
        'Unlimited client galleries',
        'Dedicated VIP Account Manager'
      ]
    }
  ];

  // 1-Click Copy UPI Number / ID
  const handleCopyUpi = (textToCopy = upiNumber) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedUpi(true);
    setReceiptToast(`Copied ${textToCopy} to clipboard ✓`);
    setTimeout(() => {
      setCopiedUpi(false);
      setReceiptToast(null);
    }, 2800);
  };

  // Save new UPI payment number
  const handleSaveUpiNumber = () => {
    const cleanNum = tempUpiInput.trim().replace(/[^0-9]/g, '');
    if (!cleanNum || cleanNum.length < 10) {
      alert('Please enter a valid mobile number (10-11 digits)');
      return;
    }
    const updated = StorageService.updatePhotographer({
      upiNumber: cleanNum,
      upiId: `${cleanNum}@upi`
    });
    setPhotographer(updated);
    setIsEditingUpi(false);
    setSuccessBanner(`✅ Payment method updated! Linked UPI: ${cleanNum} (${cleanNum}@upi)`);
    setTimeout(() => setSuccessBanner(null), 4500);
  };

  // Handle plan activation
  const handleConfirmPlanSwitch = (plan) => {
    const updated = StorageService.updatePhotographer({
      plan: plan.name,
      planPrice: plan.price === '₹0' ? '₹0 forever' : `${plan.price}/month`,
      storageLimitGb: plan.storageLimitGb
    });
    setPhotographer(updated);

    // Record invoice with active UPI details
    if (plan.price !== '₹0') {
      const formattedMethod = paymentMethod === 'upi'
        ? `UPI (${upiNumber}@upi)`
        : paymentMethod === 'card'
          ? 'Visa •••• 4242'
          : 'NetBanking';

      StorageService.addInvoice({
        plan: `${plan.name} Plan (Monthly)`,
        amount: plan.price,
        method: formattedMethod
      });
      setInvoices(StorageService.getInvoices());
    }

    setSelectedPlanModal(null);

    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    setSuccessBanner(`🎉 Plan successfully updated to ${plan.name}! Storage quota is now ${plan.storageLimitGb} GB.`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Handle Extra Storage Top-Up
  const handleAddStorageTopUp = (extraGb, cost) => {
    const newLimit = (photographer.storageLimitGb || 100) + extraGb;
    const updated = StorageService.updatePhotographer({
      storageLimitGb: newLimit
    });
    setPhotographer(updated);

    StorageService.addInvoice({
      plan: `Storage Booster (+${extraGb} GB)`,
      amount: cost,
      method: `UPI (${upiNumber}@upi)`
    });
    setInvoices(StorageService.getInvoices());

    try {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    setSuccessBanner(`⚡ Storage boosted! Added +${extraGb} GB. New total quota: ${newLimit} GB.`);
    setTimeout(() => setSuccessBanner(null), 4500);
  };

  // Download printable text receipt
  const handleDownloadReceipt = (invoice) => {
    const content = `======================================================
PHOTO PROOF STUDIO - OFFICIAL BILLING RECEIPT
======================================================
Invoice Number        : ${invoice.id}
Date                  : ${invoice.date}
Studio Name           : ${photographer.studioName}
Photographer          : ${photographer.name}
Email                 : ${photographer.email}
------------------------------------------------------
Item Description      : ${invoice.plan}
Payment Method        : ${invoice.method || `UPI (${upiNumber}@upi)`}
Primary UPI Number    : ${upiNumber}
UPI VPA ID            : ${upiId}
Payment Provider      : PhonePe / Google Pay / Paytm / BHIM
Status                : PAID (${invoice.status})
------------------------------------------------------
Total Amount Paid     : ${invoice.amount}
======================================================
Thank you for choosing PhotoProof Studio Cloud!
Website: https://photoproof.studio
Support: support@photoproof.studio
======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${invoice.id}_${photographer.studioName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReceiptToast(`Downloaded receipt for ${invoice.id} ✓`);
    setTimeout(() => setReceiptToast(null), 3000);
  };

  const usagePercent = Math.min(
    100,
    Math.round(((photographer.storageUsedGb || 72) / (photographer.storageLimitGb || 100)) * 100)
  );

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Success Notification Banner */}
      {successBanner && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <Sparkles size={18} color="#059669" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Floating Receipt Toast */}
      {receiptToast && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{receiptToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.85rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
          Billing & Subscription Plans
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
          Manage your subscription tier, linked payment methods, storage quota, and past invoices
        </p>
      </div>

      {/* 1. CURRENT SUBSCRIPTION CARD */}
      <div className="glass-card" style={{
        padding: '1.75rem',
        marginBottom: '1.75rem',
        border: '1px solid #fed7aa',
        background: 'linear-gradient(180deg, #fffbf5 0%, #ffffff 100%)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.4rem', fontSize: '0.68rem' }}>
              Active Subscription
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{photographer.plan} Plan</span>
              <span style={{ fontSize: '1.15rem', color: '#d97706' }}>{photographer.planPrice}</span>
            </h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Studio: <strong>{photographer.studioName}</strong> • Auto-renew active on <strong>{upiNumber}</strong>
            </div>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            color: '#065f46',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Zap size={14} />
            <span>38% Storage Saved with Smart Compression</span>
          </div>
        </div>

        {/* Live Storage Meter */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.45rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Cloud Storage Allocation</span>
            <strong>
              {photographer.storageUsedGb} GB used of {photographer.storageLimitGb} GB ({usagePercent}%)
            </strong>
          </div>
          <div style={{
            height: '10px',
            background: '#e2e8f0',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${usagePercent}%`,
              height: '100%',
              background: usagePercent > 90 ? '#ef4444' : usagePercent > 70 ? '#f59e0b' : '#10b981',
              borderRadius: '5px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Quick Storage Booster buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Need more cloud capacity for upcoming wedding season?
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleAddStorageTopUp(50, '₹99')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Zap size={13} color="#d97706" />
              <span>+ Add 50 GB (₹99/mo)</span>
            </button>
            <button
              onClick={() => handleAddStorageTopUp(100, '₹189')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Zap size={13} color="#d97706" />
              <span>+ Add 100 GB (₹189/mo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY PAYMENT METHOD (UPI 80109471110) CARD */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1.5px solid #fed7aa',
        background: '#ffffff',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                Saved Payment Method
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                color: '#065f46',
                fontWeight: 700,
                background: '#ecfdf5',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #a7f3d0'
              }}>
                <CheckCircle2 size={13} /> Verified Auto-Pay Active
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Primary Payment Method (UPI)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Used for automatic subscription renewals, extra storage boosters, and instant invoice payments
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCopyUpi(upiNumber)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
              title="Copy UPI Mobile Number"
            >
              {copiedUpi ? <CheckCheck size={14} color="#059669" /> : <Copy size={14} />}
              <span>{copiedUpi ? 'Copied Number!' : 'Copy Number'}</span>
            </button>
            <button
              onClick={() => handleCopyUpi(upiId)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
              title="Copy UPI VPA ID"
            >
              <Smartphone size={14} color="#d97706" />
              <span>Copy UPI ID</span>
            </button>
            <button
              onClick={() => {
                setIsEditingUpi(!isEditingUpi);
                setTempUpiInput(upiNumber);
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Edit2 size={14} />
              <span>{isEditingUpi ? 'Cancel' : 'Edit Number'}</span>
            </button>
          </div>
        </div>

        {/* UPI Visual Card & Provider Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1rem',
          alignItems: 'stretch'
        }}>
          {/* Main Dark UPI Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, transparent 70%)'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Smartphone size={18} color="#f59e0b" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#cbd5e1' }}>
                    UPI / Mobile Pay
                  </span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  color: '#fbbf24',
                  fontWeight: 700
                }}>
                  PRIMARY
                </span>
              </div>

              <div style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#ffffff',
                marginBottom: '0.35rem',
                fontFamily: 'monospace'
              }}>
                {upiNumber}
              </div>

              <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                UPI ID: <strong style={{ color: '#fbbf24' }}>{upiId}</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.85rem',
              marginTop: '0.85rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.74rem'
            }}>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <ShieldCheck size={14} /> Instant UPI Verification
              </span>
              <span style={{ color: '#cbd5e1' }}>
                Studio: {photographer.studioName}
              </span>
            </div>
          </div>

          {/* Supported Apps & Integration Panel */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Linked UPI Apps ({upiNumber})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                  <span>Google Pay</span>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#6d28d9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }} />
                  <span>PhonePe</span>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                  <span>Paytm UPI</span>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                  <span>BHIM UPI</span>
                </div>
              </div>
            </div>

            <div style={{
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              borderTop: '1px solid #e2e8f0',
              paddingTop: '0.65rem'
            }}>
              🔒 All upgrades are debited directly through <strong>{upiNumber}</strong> ({upiId}) with zero convenience fees.
            </div>
          </div>
        </div>

        {/* Inline Edit Form for Updating Payment Number */}
        {isEditingUpi && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            background: '#fffbf5',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid #fed7aa',
            animation: 'fadeIn 0.2s ease'
          }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.4rem' }}>
              Update Linked UPI Mobile Number:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={tempUpiInput}
                onChange={(e) => setTempUpiInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="input"
                placeholder="e.g. 80109471110"
                maxLength={12}
                style={{ flex: 1, minWidth: '180px', fontWeight: 700 }}
              />
              <button
                onClick={handleSaveUpiNumber}
                className="btn btn-gold btn-sm"
                style={{ fontWeight: 700, fontSize: '0.82rem' }}
              >
                Save Number
              </button>
              <button
                onClick={() => setIsEditingUpi(false)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.82rem' }}
              >
                Cancel
              </button>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Your UPI ID will automatically update to <strong>{tempUpiInput || '...'}@upi</strong>
            </div>
          </div>
        )}
      </div>

      {/* 3. AVAILABLE SUBSCRIPTION PLANS GRID */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
          Choose Your Plan
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '1.25rem' }}>
          Instant upgrade or switch. Billed securely to your primary payment method ({upiNumber}).
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1rem'
        }}>
          {plans.map((plan) => {
            const isCurrent = photographer.plan === plan.name;

            return (
              <div
                key={plan.name}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isCurrent ? '2.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                  background: isCurrent ? '#fffbf5' : '#ffffff',
                  boxShadow: isCurrent ? '0 8px 24px rgba(245, 158, 11, 0.15)' : 'var(--shadow-sm)'
                }}
              >
                {isCurrent && (
                  <span className="badge badge-gold" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.64rem' }}>
                    Active Plan ✓
                  </span>
                )}

                {plan.popular && !isCurrent && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#2563eb',
                    color: '#fff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    Most Popular
                  </span>
                )}

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem' }}>
                  {plan.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{plan.period}</span>
                </div>

                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#b45309', marginBottom: '0.15rem' }}>
                  📁 {plan.galleries}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  💾 {plan.storage}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlanModal(plan)}
                  disabled={isCurrent}
                  className={`btn ${isCurrent ? 'btn-secondary' : plan.popular ? 'btn-gold' : 'btn-secondary'}`}
                  style={{
                    width: '100%',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: isCurrent ? 'default' : 'pointer',
                    opacity: isCurrent ? 0.75 : 1
                  }}
                >
                  {isCurrent ? 'Current Plan ✓' : `Switch to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. INVOICES & BILLING HISTORY SECTION */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem' }}>
              Invoices & Payment History
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              Past charges, automatic renewals on <strong>{upiNumber}</strong>, and downloadable official receipts
            </p>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
            All Invoices Paid ✓
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="billing-desktop-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <th style={{ padding: '0.65rem 0.75rem' }}>Invoice ID</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Date</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Description</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Amount</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Payment Method</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>
                    {inv.id}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>
                    {inv.date}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{inv.plan}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inv.billingPeriod}</div>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>
                    {inv.amount}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      <Smartphone size={12} color="#d97706" />
                      {inv.method || `UPI (${upiNumber}@upi)`}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDownloadReceipt(inv)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem' }}
                      title="Download receipt"
                    >
                      <Download size={12} />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Invoice Card View */}
        <div className="billing-mobile-card-list">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                marginBottom: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{inv.id}</strong>
                <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>Paid ✓</span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{inv.plan}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Date: {inv.date} • {inv.amount} • {inv.method || `UPI (${upiNumber}@upi)`}
              </div>
              <button
                onClick={() => handleDownloadReceipt(inv)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.76rem', justifyContent: 'center' }}
              >
                <Download size={12} />
                <span>Download Receipt</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. INTERACTIVE CHECKOUT & PLAN SWITCH MODAL */}
      {selectedPlanModal && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPlanModal(null)}>
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '2rem 1.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-subtle)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                Activate {selectedPlanModal.name} Plan
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                Confirm your subscription upgrade and payment method
              </p>
            </div>

            {/* Plan Specs Review Box */}
            <div style={{
              background: '#fffbf5',
              border: '1px solid #fed7aa',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Selected Tier</span>
                <strong style={{ fontSize: '0.95rem', color: '#b45309' }}>{selectedPlanModal.name} Plan</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Price</span>
                <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>{selectedPlanModal.price} {selectedPlanModal.period}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>New Storage Quota</span>
                <strong style={{ fontSize: '0.9rem', color: '#059669' }}>{selectedPlanModal.storageLimitGb} GB Storage</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.45rem' }}>
                Select Payment Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', marginBottom: '0.65rem' }}>
                {[
                  { id: 'upi', label: 'UPI Auto-Pay', icon: Smartphone },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBank', icon: ShieldCheck }
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '0.65rem 0.4rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: paymentMethod === m.id ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                      background: paymentMethod === m.id ? '#fffbeb' : '#ffffff',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: paymentMethod === m.id ? '#b45309' : 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <m.icon size={16} />
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* UPI Custom Info Box when UPI selected */}
              {paymentMethod === 'upi' ? (
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #fed7aa',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Linked UPI Payment Method
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                      Auto-Verified ✓
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                        {upiNumber}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 600 }}>
                        {upiId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyUpi(upiNumber)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                    >
                      {copiedUpi ? <CheckCheck size={12} color="#059669" /> : <Copy size={12} />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>⚡ Pay using Google Pay, PhonePe, Paytm or BHIM UPI</span>
                  </div>
                </div>
              ) : paymentMethod === 'card' ? (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}>
                  💳 Visa •••• 4242 (Expires 12/28)
                </div>
              ) : (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}>
                  🏦 All major Indian banks supported (HDFC, SBI, ICICI, Axis)
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => handleConfirmPlanSwitch(selectedPlanModal)}
                className="btn btn-gold btn-lg"
                style={{ width: '100%', fontWeight: 700, fontSize: '0.92rem' }}
              >
                <span>🚀 Confirm & Activate {selectedPlanModal.name} Plan</span>
              </button>

              <button
                onClick={() => setSelectedPlanModal(null)}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.84rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .billing-mobile-card-list {
          display: none;
        }
        .billing-desktop-table {
          display: block;
        }
        @media (max-width: 768px) {
          .billing-mobile-card-list {
            display: block !important;
          }
          .billing-desktop-table {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
