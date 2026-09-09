const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const photoRoutes = require('./routes/photoRoutes');
const clientRoutes = require('./routes/clientRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Root Health Check
app.get('/', (req, res) => {
  res.json({
    name: 'PhotoProof Backend API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [PhotoProof Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
