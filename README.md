# 📸 PhotoProof — Smart Client Proofing & Studio Management SaaS

A modern, high-performance photo proofing and studio management platform built for wedding, event, and portrait photographers. Solves high cloud storage bills and long WhatsApp client selection delays with smart image compression, live selection counters, Lightroom CSV exports, and full UPI/subscription billing.

---

## 🌟 Key Features

### 💻 Client Proofing App Experience
- **Pristine White Native SaaS UI**: High-contrast, mobile-first interface with fixed bottom navigation bar for phones.
- **Client Selection Limiter**: Set exact quotas (e.g. 120 selections out of 500 photos). Dynamic floating counter badge prevents over-selection.
- **Per-Photo Retouch Comments**: Clients can click on any photo to request specific edits (e.g., retouch glare, background lighting).
- **Lightroom CSV & Filenames Export**: 1-click export of selected photo filenames for instant Lightroom / Photoshop filtering.
- **WhatsApp 1-Click Invites**: Direct WhatsApp integration with pre-filled greeting and gallery password.
- **Private Galleries**: Password protection and unique slugs per client.

### ⚡ Studio Management & Billing
- **Interactive Subscription Tiers**: FREE (2 GB), STARTER (20 GB), PRO (100 GB), and STUDIO (250 GB).
- **Integrated Payment System**: Configured with UPI Auto-Pay (`80109471110` / `80109471110@upi`) supporting Google Pay, PhonePe, and Paytm.
- **Storage Boosters**: Instant quota top-ups (+50 GB / +100 GB).
- **Official Invoice Receipts**: Downloadable text receipts for every transaction.

---

## 🏗️ Architecture

```
photographer-photos-problem/
├── src/                         # Frontend (React 18 + Vite)
│   ├── assets/                  # Logos and icons
│   ├── components/              # Reusable UI cards, tables, modal lightbox
│   ├── layouts/                 # DashboardLayout & PublicLayout
│   ├── pages/                   # Auth, Dashboard, Galleries, Clients, Billing
│   ├── services/                # StorageService (LocalStorage + API layer)
│   ├── App.jsx                  # React Router v6 setup
│   ├── index.css                # Pure CSS design system & tokens
│   └── main.jsx
├── photoproof-backend/          # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/              # MongoDB & Cloudinary SDK
│   │   ├── controllers/         # Auth, Galleries, Photos, Clients, Subscription
│   │   ├── middleware/          # JWT auth, Multer memory storage, Error handler
│   │   ├── models/              # User, Gallery, Photo, Selection, Comment
│   │   ├── routes/              # Express REST APIs
│   │   ├── services/            # Sharp image compression & WebP converter
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── package.json                 # Frontend dependencies
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

### 2. Backend Setup
```bash
cd photoproof-backend

# Install backend dependencies
npm install

# Configure environment variables
cp .env.example .env
# Update MONGO_URI, JWT_SECRET, and Cloudinary keys in .env

# Run backend server
npm run dev
# Or start directly:
node src/server.js
```

---

## ☁️ Deployment Guide

### Deploying Frontend (Vercel / Netlify / Cloudflare Pages)
1. Link your GitHub repository to **Vercel** or **Netlify**.
2. **Framework Preset**: `Vite`
3. **Root Directory**: `./`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### Deploying Backend (Render / Railway / Heroku)
1. Link your GitHub repository to **Render** or **Railway**.
2. **Root Directory**: `photoproof-backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node src/server.js`
5. **Environment Variables**:
   - `PORT=5000`
   - `MONGO_URI` (from MongoDB Atlas)
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` (URL of your deployed frontend)

---

## 📄 License
MIT License. Built for professional photographers and creative studios.
