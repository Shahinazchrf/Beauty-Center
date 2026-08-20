const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // SQL: user_id INT FK
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // SQL: title VARCHAR(150)
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    
    // SQL: message TEXT
    message: {
        type: String,
        required: true
    },
    
    // SQL: type ENUM
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    
    // SQL: related_appointment_id INT FK NULL
    relatedAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    },
    
    // SQL: is_read BOOLEAN
    isRead: {
        type: Boolean,
        default: false
    }

}, {
    // SQL: created_at DATETIME
    timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);