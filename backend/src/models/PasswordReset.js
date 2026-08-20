const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    // SQL: user_id INT FK
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // SQL: token VARCHAR(255)
    token: {
        type: String,
        required: true
    },
    
    // SQL: expires_at DATETIME
    expiresAt: {
        type: Date,
        required: true
    },
    
    // SQL: used BOOLEAN
    used: {
        type: Boolean,
        default: false
    }

}, {
    // SQL: created_at DATETIME
    timestamps: true 
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);