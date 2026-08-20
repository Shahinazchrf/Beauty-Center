const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { bookAppointment, getMyAppointments } = require('../controllers/appointmentController');

// Client routes
router.post('/', authenticate, bookAppointment);
router.get('/', authenticate, getMyAppointments);

module.exports = router;