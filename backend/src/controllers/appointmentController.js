const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Notification = require('../models/Notification');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res) => {
    try {
        const { serviceId, appointmentDate, startTime, endTime, notes } = req.body;
        const userId = req.userId;

        console.log("📩 Booking Request:", req.body);

        // 1. Check if the service actually exists in the DB
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found in database' });
        }

        // 2. Create the appointment
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

// @desc    Get all appointments (ADMIN gets ALL, CLIENT gets only their own)
// @route   GET /api/appointments
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        let appointments;
        
        // Check if user is admin
        if (req.userRole === 'admin') {
            // ADMIN: Get ALL appointments with client info
            appointments = await Appointment.find()
                .populate('client', 'firstName lastName email phone')
                .populate('service', 'name image duration price')
                .sort({ appointmentDate: -1 });
        } else {
            // CLIENT: Get only their appointments
            appointments = await Appointment.find({ client: req.userId })
                .populate('client', 'firstName lastName email phone')
                .populate('service', 'name image duration price')
                .sort({ appointmentDate: -1 });
        }

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin function to confirm an appointment
// @route   PUT /api/appointments/confirm/:id
// @access  Private (Admin only)
const confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user is admin
        if (req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
        }

        // ✅ FIX: Get the RAW appointment first (client is ObjectId)
        const rawAppointment = await Appointment.findById(id);
        
        if (!rawAppointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // ✅ FIX: Get the client ID correctly
        const clientId = rawAppointment.client;
        console.log('✅ Client ID:', clientId); // DEBUG

        // Get service info for the notification
        const service = await Service.findById(rawAppointment.service);
        console.log('✅ Service:', service?.name); // DEBUG

        // Update the status to "Confirmed"
        rawAppointment.status = 'Confirmed';
        await rawAppointment.save();

        // ✅ CREATE NOTIFICATION FOR THE CLIENT
        console.log('📨 Creating notification for client:', clientId); // DEBUG
        
        const notification = await Notification.create({
            user: clientId,
            title: '✅ Appointment Confirmed!',
            message: `Your appointment for ${service?.name || 'Service'} on ${new Date(rawAppointment.appointmentDate).toLocaleDateString()} at ${rawAppointment.startTime} has been confirmed.`,
            type: 'success',
            relatedAppointment: rawAppointment._id,
            isRead: false
        });

        console.log('✅ Notification created:', notification); // DEBUG

        // ✅ FIX: Populate the appointment for response
        const populatedAppointment = await Appointment.findById(id)
            .populate('client', 'firstName lastName email phone')
            .populate('service', 'name image duration price');

        res.status(200).json({ 
            success: true, 
            data: populatedAppointment,
            notification: notification,
            message: 'Appointment confirmed! Notification sent to client.'
        });
    } catch (error) {
        console.error('❌ Confirm Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/cancel/:id
// @access  Private
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the appointment first to check ownership
        const appointment = await Appointment.findById(id);
        
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        // Check if user is the owner OR an admin
        if (req.userRole !== 'admin' && appointment.client.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'Access denied. You can only cancel your own appointments.' });
        }

        // Update the status to "Cancelled"
        appointment.status = 'Cancelled';
        appointment.cancellationReason = 'Cancelled by user';
        await appointment.save();

        res.status(200).json({ success: true, data: appointment, message: 'Appointment cancelled!' });
    } catch (error) {
        console.error('❌ Cancel Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get available time slots for a specific service and date
// @route   GET /api/appointments/available
// @access  Private
const getAvailableSlots = async (req, res) => {
    try {
        const { serviceId, date } = req.query;
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            service: serviceId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        const bookedSlots = appointments.map(app => app.startTime);
        
        const allSlots = [
            "09:00", "10:00", "11:00", "12:00", 
            "14:00", "15:00", "16:00", "17:00", "18:00"
        ];

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.status(200).json({
            success: true,
            availableSlots
        });

    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { bookAppointment, getMyAppointments, confirmAppointment, cancelAppointment, getAvailableSlots };