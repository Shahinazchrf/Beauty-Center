const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, trim: true, maxlength: 100, default: '' },
    lastName: { type: String, trim: true, maxlength: 100, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    language: { type: String, enum: ['fr', 'en', 'ar'], default: 'fr' },
    isActive: { type: Boolean, default: true },
    
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    loyaltyPoints: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    lastLogin: { type: Date }
}, { timestamps: true });

// ✅ THE FIX: Mongoose 9 does NOT use next()!
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);