const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Load environment variables
dotenv.config();

// 🔍 ADD THESE TWO LINES FOR DEBUGGING
console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('📦 MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('🔑 JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

// Connect to database
connectDB();

const app = express();

// Import models
require('./src/models/User');
require('./src/models/Service');
require('./src/models/Appointment');
require('./src/models/Notification');
require('./src/models/Offer');
require('./src/models/OfferService');
require('./src/models/PasswordReset');

// ✅ UPDATE CORS - Add your Render URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://beautybook-frontend-bay.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- ROUTES ----------
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));

// ✅ ADD HEALTH CHECK ROUTE
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'BeautyBook API is running... 🚀',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'BeautyBook API is running... 🚀',
    endpoints: {
      health: '/health',
      api: '/api',
      services: '/api/services',
      auth: '/api/auth',
      appointments: '/api/appointments'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});