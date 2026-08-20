const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res) => {
    try {
        const { serviceId, appointmentDate, startTime, endTime, notes } = req.body;
        const userId = req.userId;

        console.log("📩 Booking Request:", req.body); // For debugging

        // 1. Check if the service actually exists in the DB
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found in database' });
        }

        // 2. Create the appointment with REAL data
        const appointment = await Appointment.create({
            client: userId,
            service: serviceId,
            appointmentDate: new Date(appointmentDate),
            startTime: startTime,
            endTime: endTime,
            price: service.price,
            status: 'Pending',
            notes: notes || null,
            cancellationReason: null
        });

        res.status(201).json({
            success: true,
            data: appointment,
            message: 'Appointment booked successfully!'
        });

    } catch (error) {
        console.error('❌ Booking Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all appointments for the logged-in user
// @route   GET /api/appointments
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.userId })
            .populate('service', 'name image duration') // Gets service name, image, duration
            .sort({ appointmentDate: -1 });

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { bookAppointment, getMyAppointments };