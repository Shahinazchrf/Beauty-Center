const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centre_esthetique');

const User = require('./src/models/User');

const resetAdmin = async () => {
    try {
        // Delete existing admin
        await User.deleteOne({ email: 'admin@beautybook.com' });
        console.log('🗑️  Deleted existing admin');
        
        // Create admin - NO manual hashing! The model's pre('save') hook will hash it
        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@beautybook.com',
            username: 'admin',
            password: 'admin123', // PLAIN TEXT - the hook will hash it
            role: 'admin',
            isActive: true,
            language: 'en',
            loyaltyPoints: 0,
            totalAppointments: 0
        });
        
        console.log('✅ Admin recreated successfully!');
        console.log('📧 Email: admin@beautybook.com');
        console.log('🔑 Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAdmin();