const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { bookAppointment, getMyAppointments, confirmAppointment, cancelAppointment } = require('../controllers/appointmentController');

// Client routes
router.post('/', authenticate, bookAppointment);
router.get('/', authenticate, getMyAppointments);

// ✅ NEW: Client route to cancel an appointment
router.put('/cancel/:id', authenticate, cancelAppointment);

// Admin route
router.put('/confirm/:id', authenticate, isAdmin, confirmAppointment);

module.exports = router;