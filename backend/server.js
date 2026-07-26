const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',//React app
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routes
app.use('/api/auth',require('./src/routes/authRoutes'));
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BeautyBook API is running... 🚀' });
});

// Import routes (we'll create these later)
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/services', require('./src/routes/serviceRoutes'));
// app.use('/api/appointments', require('./src/routes/appointmentRoutes'));

// Error handling middleware (we'll create this later)
app.use((err,req,res,next) =>{
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Somthing wnt worng!',
    error: process.env.NODE_ENV === 'development' ? err.message :{}
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});