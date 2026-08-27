const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // SQL: user_id INT FK
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    
    message: {
        type: String,
        required: true
    },
    
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    
    relatedAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    },
    
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);