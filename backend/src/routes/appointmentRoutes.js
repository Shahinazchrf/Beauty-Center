const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { bookAppointment, getMyAppointments, confirmAppointment, cancelAppointment, getAvailableSlots } = require('../controllers/appointmentController');

// Client routes
router.post('/', authenticate, bookAppointment);
router.get('/', authenticate, getMyAppointments);

// ✅ Route to get available slots
router.get('/available', authenticate, getAvailableSlots);

// ✅ Admin route to confirm (with notification)
router.put('/confirm/:id', authenticate, confirmAppointment);

// Cancel route
router.put('/cancel/:id', authenticate, cancelAppointment);

module.exports = router;