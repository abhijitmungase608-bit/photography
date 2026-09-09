import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth / Login Page (Now the default entry page at /)
import Auth from './pages/public/Auth';

// Marketing pages (accessible via /features, /pricing, etc.)
import Home from './pages/public/Home';
import Features from './pages/public/Features';
import Pricing from './pages/public/Pricing';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import PublicLayout from './layouts/PublicLayout';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import GalleriesList from './pages/dashboard/GalleriesList';
import CreateGallery from './pages/dashboard/CreateGallery';
import GalleryDetail from './pages/dashboard/GalleryDetail';
import Clients from './pages/dashboard/Clients';
import Billing from './pages/dashboard/Billing';
import Settings from './pages/dashboard/Settings';

// Client Portal
import ClientGallery from './pages/client/ClientGallery';

// Storage Initialization
import { StorageService } from './services/storage';

export default function App() {
  useEffect(() => {
    StorageService.init();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Main Entry: Photographer Login Page */}
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* 2. Photographer Dashboard Hub */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="galleries" element={<GalleriesList />} />
          <Route path="galleries/create" element={<CreateGallery />} />
          <Route path="galleries/:id" element={<GalleryDetail />} />
          <Route path="clients" element={<Clients />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 3. Client Gallery Portal (Dedicated, isolated from dashboard) */}
        <Route path="/gallery/:gallerySlug" element={<ClientGallery />} />

        {/* 4. Public / Marketing Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/landing" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Fallback to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
