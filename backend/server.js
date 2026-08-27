const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');


// Load environment variables
dotenv.config();

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

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- ROUTES ----------
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes')); // <-- UNCOMMENTED THIS LINE
app.use('/api/services', require('./src/routes/serviceRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BeautyBook API is running... 🚀' });
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

app.use('/api/notifications', require('./src/routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});