const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // SQL: first_name VARCHAR(100)
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    // SQL: last_name VARCHAR(100)
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    // SQL: email VARCHAR(150) UNIQUE
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // SQL: phone VARCHAR(30)
    phone: {
        type: String,
        trim: true,
        maxlength: 30,
        default: ''
    },
    // SQL: password VARCHAR(255) Hashed
    password: {
        type: String,
        required: true
    },
    // SQL: profile_image VARCHAR(255) NULL
    profileImage: {
        type: String,
        default: null
    },
    // SQL: role ENUM(admin, client)
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
    // SQL: language VARCHAR(10)
    language: {
        type: String,
        enum: ['fr', 'en', 'ar'],
        default: 'fr'
    },
    // SQL: is_active BOOLEAN
    isActive: {
        type: Boolean,
        default: true
    },

    // --- EXTRA FIELDS FROM YOUR EXISTING CODE ---
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    totalAppointments: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date
    }

}, {
    // SQL: created_at DATETIME, updated_at DATETIME (Auto-handled by Mongoose)
    timestamps: true 
});

// Hash password before saving (Matches your code)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);