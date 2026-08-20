const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    // SQL: title VARCHAR(150)
    title: {
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
    
    // SQL: discount_percentage DECIMAL(5,2)
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    
    // SQL: start_date DATE
    startDate: {
        type: Date,
        required: true
    },
    
    // SQL: end_date DATE
    endDate: {
        type: Date,
        required: true
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
    timestamps: true 
});

module.exports = mongoose.model('Offer', offerSchema);