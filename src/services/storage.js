/**
 * Local Data Persistence & Mock Service for PhotoProof
 * Stores galleries, photos, client feedback, and compression stats in LocalStorage
 */

const STORAGE_KEYS = {
  GALLERIES: 'photoproof_galleries',
  PHOTOS: 'photoproof_photos',
  PHOTOGRAPHER: 'photoproof_photographer',
  CLIENTS: 'photoproof_clients',
  INVOICES: 'photoproof_invoices'
};

// Curated high quality wedding & event photos (Unsplash verified high-speed CDN)
const SAMPLE_IMAGE_POOL = [
  {
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=70',
    category: 'Wedding'
  },
  {
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=70',
    category: 'Portraits'
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=70',
    category: 'Wedding'
  },
  {
    url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=500&q=70',
    category: 'Haldi'
  },
  {
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=70',
    category: 'Reception'
  },
  {
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&q=70',
    category: 'Sangeet'
  },
  {
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=500&q=70',
    category: 'Haldi'
  },
  {
    url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=500&q=70',
    category: 'Portraits'
  },
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=500&q=70',
    category: 'Wedding'
  },
  {
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=70',
    category: 'Reception'
  },
  {
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=500&q=70',
    category: 'Sangeet'
  },
  {
    url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=500&q=70',
    category: 'Wedding'
  }
];

// Initial Photographer profile
const INITIAL_PHOTOGRAPHER = {
  name: 'Abhi',
  studioName: 'Studio One Photography',
  email: 'abhi@studioone.in',
  phone: '+91 80109 471110',
  upiNumber: '80109471110',
  upiId: '80109471110@upi',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  plan: 'PRO',
  planPrice: '₹499/month',
  storageUsedGb: 72,
  storageLimitGb: 100,
  savingsPercent: 38,
  totalGalleries: 12,
  totalPhotos: 2450,
  watermarkText: '© Studio One Photography',
  watermarkEnabled: true
};

// Initial Seed Galleries
const INITIAL_GALLERIES = [
  {
    id: 'gallery_1',
    slug: 'rahul-priya-wedding',
    title: 'Rahul & Priya Wedding',
    clientName: 'Rahul Sharma',
    clientEmail: 'rahul.sharma@example.com',
    clientPhone: '+91 98765 43210',
    eventDate: '2026-10-15',
    selectionLimit: 120,
    selectedCount: 120,
    totalPhotos: 500,
    isPasswordProtected: true,
    password: 'wedding2026',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-01',
    savedStorageMb: 1920,
    allowDownload: true
  },
  {
    id: 'gallery_2',
    slug: 'sneha-event',
    title: 'Sneha Sangeet Night',
    clientName: 'Sneha Kapoor',
    clientEmail: 'sneha.k@example.com',
    clientPhone: '+91 98112 34567',
    eventDate: '2026-11-02',
    selectionLimit: 80,
    selectedCount: 45,
    totalPhotos: 320,
    isPasswordProtected: true,
    password: 'sneha2026',
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-05',
    savedStorageMb: 1220,
    allowDownload: false
  },
  {
    id: 'gallery_3',
    slug: 'akash-birthday',
    title: 'Akash 1st Birthday',
    clientName: 'Akash Verma',
    clientEmail: 'akash.v@example.com',
    clientPhone: '+91 99223 88441',
    eventDate: '2026-09-20',
    selectionLimit: 50,
    selectedCount: 0,
    totalPhotos: 180,
    isPasswordProtected: false,
    password: '',
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-08',
    savedStorageMb: 680,
    allowDownload: true
  }
];

// Generate 500 Photos for Rahul & Priya Wedding
function generateRahulPriyaPhotos() {
  const photos = [];
  for (let i = 1; i <= 500; i++) {
    const poolItem = SAMPLE_IMAGE_POOL[(i - 1) % SAMPLE_IMAGE_POOL.length];
    const isSpecial182 = i === 182;
    // Exactly 120 selected to match prompt
    const isSelected = isSpecial182 || i <= 119;
    const isFavorite = isSpecial182 || i % 15 === 0;

    const comments = [];
    if (isSpecial182) {
      comments.push({
        id: 'c_182',
        author: 'Rahul Sharma',
        text: 'Please edit this photo - brighten the backlight and remove glare',
        createdAt: 'Yesterday at 4:32 PM'
      });
    } else if (i === 42) {
      comments.push({
        id: 'c_42',
        author: 'Priya Sharma',
        text: 'Love the candid expression here! Keep in album.',
        createdAt: '2 days ago'
      });
    }

    photos.push({
      id: `photo_rp_${i}`,
      photoNumber: i,
      galleryId: 'gallery_1',
      fileName: `IMG_${8000 + i}.CR3`,
      url: poolItem.url,
      thumbnailUrl: poolItem.thumb,
      category: poolItem.category,
      originalSize: 8.2 * 1024 * 1024,
      compressedSize: 950 * 1024,
      isSelected,
      isFavorite,
      comments
    });
  }
  return photos;
}

// Generate smaller sets for other galleries
function generateSnehaPhotos() {
  const photos = [];
  for (let i = 1; i <= 320; i++) {
    const poolItem = SAMPLE_IMAGE_POOL[(i + 3) % SAMPLE_IMAGE_POOL.length];
    const isSelected = i <= 45;
    photos.push({
      id: `photo_sneha_${i}`,
      photoNumber: i,
      galleryId: 'gallery_2',
      fileName: `SNEHA_${2000 + i}.RAW`,
      url: poolItem.url,
      thumbnailUrl: poolItem.thumb,
      category: poolItem.category,
      originalSize: 7.8 * 1024 * 1024,
      compressedSize: 920 * 1024,
      isSelected,
      isFavorite: i % 12 === 0,
      comments: []
    });
  }
  return photos;
}

function generateAkashPhotos() {
  const photos = [];
  for (let i = 1; i <= 180; i++) {
    const poolItem = SAMPLE_IMAGE_POOL[(i + 5) % SAMPLE_IMAGE_POOL.length];
    photos.push({
      id: `photo_akash_${i}`,
      photoNumber: i,
      galleryId: 'gallery_3',
      fileName: `AKASH_${1000 + i}.RAW`,
      url: poolItem.url,
      thumbnailUrl: poolItem.thumb,
      category: poolItem.category,
      originalSize: 6.8 * 1024 * 1024,
      compressedSize: 850 * 1024,
      isSelected: false,
      isFavorite: false,
      comments: []
    });
  }
  return photos;
}

export const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.GALLERIES)) {
      localStorage.setItem(STORAGE_KEYS.GALLERIES, JSON.stringify(INITIAL_GALLERIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PHOTOGRAPHER)) {
      localStorage.setItem(STORAGE_KEYS.PHOTOGRAPHER, JSON.stringify(INITIAL_PHOTOGRAPHER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PHOTOS)) {
      const allPhotos = [
        ...generateRahulPriyaPhotos(),
        ...generateSnehaPhotos(),
        ...generateAkashPhotos()
      ];
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(allPhotos));
    }
  },

  getPhotographer() {
    this.init();
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOGRAPHER)) || INITIAL_PHOTOGRAPHER;
      // Auto-populate / migrate user's UPI number
      if (!stored.upiNumber || stored.upiNumber !== '80109471110') {
        stored.upiNumber = '80109471110';
        stored.upiId = '80109471110@upi';
        localStorage.setItem(STORAGE_KEYS.PHOTOGRAPHER, JSON.stringify(stored));
      }
      return stored;
    } catch {
      return INITIAL_PHOTOGRAPHER;
    }
  },

  updatePhotographer(updates) {
    const current = this.getPhotographer();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PHOTOGRAPHER, JSON.stringify(updated));
    return updated;
  },

  getPaymentDetails() {
    const photog = this.getPhotographer();
    return {
      upiNumber: photog.upiNumber || '80109471110',
      upiId: photog.upiId || '80109471110@upi',
      type: 'UPI Auto-Pay',
      provider: 'PhonePe / Google Pay / Paytm',
      status: 'Active & Verified',
      isDefault: true
    };
  },

  updatePaymentDetails(details) {
    return this.updatePhotographer(details);
  },

  getGalleries() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERIES)) || INITIAL_GALLERIES;
    } catch {
      return INITIAL_GALLERIES;
    }
  },

  getGalleryBySlug(slug) {
    const galleries = this.getGalleries();
    return galleries.find((g) => g.slug === slug || g.id === slug) || null;
  },

  getGalleryById(id) {
    const galleries = this.getGalleries();
    return galleries.find((g) => g.id === id || g.slug === id) || null;
  },

  createGallery(galleryData) {
    const galleries = this.getGalleries();
    const slug = (galleryData.title || 'gallery')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newGallery = {
      id: `gallery_${Date.now()}`,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      totalPhotos: 0,
      selectedCount: 0,
      savedStorageMb: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      ...galleryData
    };

    galleries.unshift(newGallery);
    localStorage.setItem(STORAGE_KEYS.GALLERIES, JSON.stringify(galleries));

    const photog = this.getPhotographer();
    this.updatePhotographer({ totalGalleries: (photog.totalGalleries || 0) + 1 });

    return newGallery;
  },

  updateGallery(id, updates) {
    const galleries = this.getGalleries();
    const index = galleries.findIndex((g) => g.id === id || g.slug === id);
    if (index !== -1) {
      galleries[index] = { ...galleries[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.GALLERIES, JSON.stringify(galleries));
      return galleries[index];
    }
    return null;
  },

  deleteGallery(id) {
    let galleries = this.getGalleries();
    galleries = galleries.filter((g) => g.id !== id && g.slug !== id);
    localStorage.setItem(STORAGE_KEYS.GALLERIES, JSON.stringify(galleries));

    let photos = this.getAllPhotos();
    photos = photos.filter((p) => p.galleryId !== id);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  },

  getAllPhotos() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS)) || [];
    } catch {
      return [];
    }
  },

  getPhotosByGallery(galleryIdOrSlug) {
    const gallery = this.getGalleryById(galleryIdOrSlug) || this.getGalleryBySlug(galleryIdOrSlug);
    const targetId = gallery ? gallery.id : galleryIdOrSlug;
    const all = this.getAllPhotos();
    return all.filter((p) => p.galleryId === targetId);
  },

  generateDemoPhotosForGallery(galleryId, count = 500) {
    const all = this.getAllPhotos();
    const existing = all.filter((p) => p.galleryId === galleryId);
    let startNumber = existing.length + 1;
    const newPhotos = [];

    for (let i = 1; i <= count; i++) {
      const poolItem = SAMPLE_IMAGE_POOL[(i - 1) % SAMPLE_IMAGE_POOL.length];
      newPhotos.push({
        id: `photo_${galleryId}_${startNumber + i}`,
        photoNumber: startNumber + i - 1,
        galleryId,
        fileName: `IMG_${7000 + startNumber + i}.CR3`,
        url: poolItem.url,
        thumbnailUrl: poolItem.thumb,
        category: poolItem.category,
        originalSize: 8.2 * 1024 * 1024,
        compressedSize: 950 * 1024,
        isSelected: false,
        isFavorite: false,
        comments: []
      });
    }

    const combined = [...newPhotos, ...all];
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(combined));

    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      this.updateGallery(galleryId, {
        totalPhotos: (gallery.totalPhotos || 0) + count
      });
    }

    return newPhotos;
  },

  addPhotosToGallery(galleryId, newPhotoList) {
    const all = this.getAllPhotos();
    const existingForGallery = all.filter((p) => p.galleryId === galleryId);
    let startNumber = existingForGallery.length + 1;

    const formatted = newPhotoList.map((item, idx) => ({
      id: `photo_${Date.now()}_${idx}`,
      photoNumber: startNumber + idx,
      galleryId,
      fileName: item.fileName || `PHOTO_${startNumber + idx}.webp`,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl || item.url,
      category: item.category || 'Wedding',
      originalSize: item.originalSize || 8200000,
      compressedSize: item.compressedSize || 950000,
      isSelected: false,
      isFavorite: false,
      comments: []
    }));

    const combined = [...formatted, ...all];
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(combined));

    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      this.updateGallery(galleryId, {
        totalPhotos: (gallery.totalPhotos || 0) + formatted.length
      });
    }

    return formatted;
  },

  togglePhotoSelection(photoId) {
    const all = this.getAllPhotos();
    const photo = all.find((p) => p.id === photoId);
    if (photo) {
      photo.isSelected = !photo.isSelected;
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(all));
      this.recountGallerySelections(photo.galleryId);
      return photo;
    }
    return null;
  },

  togglePhotoFavorite(photoId) {
    const all = this.getAllPhotos();
    const photo = all.find((p) => p.id === photoId);
    if (photo) {
      photo.isFavorite = !photo.isFavorite;
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(all));
      return photo;
    }
    return null;
  },

  addPhotoComment(photoId, commentText, author = 'Client') {
    const all = this.getAllPhotos();
    const photo = all.find((p) => p.id === photoId);
    if (photo) {
      if (!photo.comments) photo.comments = [];
      const newComment = {
        id: `comment_${Date.now()}`,
        author,
        text: commentText,
        createdAt: 'Just now'
      };
      photo.comments.push(newComment);
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(all));
      return newComment;
    }
    return null;
  },

  recountGallerySelections(galleryId) {
    const allPhotos = this.getAllPhotos();
    const galleryPhotos = allPhotos.filter((p) => p.galleryId === galleryId);
    const selectedCount = galleryPhotos.filter((p) => p.isSelected).length;

    this.updateGallery(galleryId, {
      selectedCount,
      totalPhotos: galleryPhotos.length
    });
    return selectedCount;
  },

  submitGallerySelection(galleryId, notes = '') {
    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      this.updateGallery(galleryId, {
        status: 'completed',
        clientNotes: notes,
        submittedAt: new Date().toISOString()
      });
    }
  },

  getInvoices() {
    this.init();
    const defaultInvoices = [
      {
        id: 'INV-90412',
        date: '15 Aug 2026',
        plan: 'PRO Plan (Monthly)',
        amount: '₹499',
        status: 'Paid',
        method: 'UPI (80109471110@upi)',
        billingPeriod: '15 Aug 2026 – 15 Sep 2026'
      },
      {
        id: 'INV-88301',
        date: '15 Jul 2026',
        plan: 'PRO Plan (Monthly)',
        amount: '₹499',
        status: 'Paid',
        method: 'UPI (80109471110@upi)',
        billingPeriod: '15 Jul 2026 – 15 Aug 2026'
      },
      {
        id: 'INV-86102',
        date: '15 Jun 2026',
        plan: 'PRO Plan (Monthly)',
        amount: '₹499',
        status: 'Paid',
        method: 'UPI (80109471110@upi)',
        billingPeriod: '15 Jun 2026 – 15 Jul 2026'
      }
    ];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(defaultInvoices));
        return defaultInvoices;
      }
      const parsed = JSON.parse(stored);
      // If invoices exist with older Google Pay text, map to user's UPI number
      return parsed.map((inv) => ({
        ...inv,
        method: inv.method && inv.method.includes('Google Pay') ? 'UPI (80109471110@upi)' : (inv.method || 'UPI (80109471110@upi)')
      }));
    } catch {
      return defaultInvoices;
    }
  },

  addInvoice(invoice) {
    const invoices = this.getInvoices();
    const newInvoice = {
      id: invoice.id || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      date: invoice.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      plan: invoice.plan || 'Plan Upgrade',
      amount: invoice.amount || '₹499',
      status: 'Paid',
      method: invoice.method || 'UPI (80109471110@upi)',
      billingPeriod: 'Active Tier'
    };
    invoices.unshift(newInvoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    return newInvoice;
  }
};
