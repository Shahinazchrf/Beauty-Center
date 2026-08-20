const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // SQL: client_id INT FK -> Client
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    
    // SQL: service_id INT FK -> Service
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', // References the Service model
        required: true
    },
    
    // SQL: appointment_date DATE
    appointmentDate: {
        type: Date,
        required: true
    },
    
    // SQL: start_time TIME
    startTime: {
        type: String, // Stored as "HH:MM" format (e.g., "14:00")
        required: true
    },
    
    // SQL: end_time TIME
    endTime: {
        type: String, // Stored as "HH:MM" format (e.g., "15:00")
        required: true
    },
    
    // SQL: price DECIMAL(10,2)
    price: {
        type: Number,
        required: true
    },
    
    // SQL: status ENUM
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    
    // SQL: notes TEXT NULL
    notes: {
        type: String,
        default: null
    },
    
    // SQL: cancellation_reason TEXT NULL
    cancellationReason: {
        type: String,
        default: null
    }

}, {
    // SQL: created_at DATETIME, updated_at DATETIME
    timestamps: true 
});

module.exports = mongoose.model('Appointment', appointmentSchema);