const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    // SQL: name VARCHAR(150)
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    
    // SQL: description TEXT
    description: {
        type: String,
        default: ''
    },
    
    // SQL: price DECIMAL(10,2)
    price: {
        type: Number,
        required: true,
        min: 0
    },
    
    // SQL: duration INT (in minutes)
    duration: {
        type: Number, // Store as minutes, e.g., 60 for 1 hour
        required: true,
        min: 1
    },
    
    // SQL: image VARCHAR(255) NULL
    image: {
        type: String,
        default: null
    },
    
    // SQL: is_active BOOLEAN
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    // SQL: created_at DATETIME, updated_at DATETIME
    timestamps: true // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.model('Service', serviceSchema);