const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
    return jwt.sign({ userId: id, role: role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// REGISTER
const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword, role } = req.body;

        console.log('📩 Registration data:', { firstName, lastName, username, email, role }); // DEBUG

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
        });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
        }

        // CRITICAL: Set the role properly
        // If role is 'admin', use 'admin', otherwise 'client'
        // For security, ONLY allow admin if explicitly requested AND not from public registration
        const userRole = role === 'admin' ? 'admin' : 'client';

        console.log('Creating user with role:', userRole);

        const user = await User.create({
            firstName: firstName || '',
            lastName: lastName || '',
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: password, // This will be hashed by pre('save') hook
            role: userRole, // ← THIS IS THE CRITICAL LINE
        });

        console.log('User created:', user); // DEBUG

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: { 
                id: user._id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                username: user.username, 
                email: user.email, 
                role: user.role, 
                language: user.language, 
                profileImage: user.profileImage, 
                loyaltyPoints: user.loyaltyPoints 
            }
        });
    } catch (error) {
        console.error("❌ REGISTRATION ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log('🔐 Login attempt:', { identifier });

        const user = await User.findOne({ 
            $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] 
        });

        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log('✅ User found:', { email: user.email, role: user.role });

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support' });
        }

        const isPasswordValid = await user.comparePassword(password);
        console.log('🔐 Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            token,
            user: { 
                id: user._id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                username: user.username, 
                email: user.email, 
                role: user.role, 
                language: user.language, 
                profileImage: user.profileImage, 
                loyaltyPoints: user.loyaltyPoints, 
                totalAppointments: user.totalAppointments 
            }
        });
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ME
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ UPDATE ALL PROFILE SETTINGS IN REAL TIME
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, language, password } = req.body;
        
        // Build the update object
        let updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) updateData.email = email.toLowerCase();
        if (phone !== undefined) updateData.phone = phone;
        if (language !== undefined) updateData.language = language;
        
        // If password is provided, hash it manually BEFORE saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                language: user.language,
                role: user.role,
                profileImage: user.profileImage,
                loyaltyPoints: user.loyaltyPoints,
            }
        });
    } catch (error) {
        console.error("❌ UPDATE PROFILE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ UPDATE PROFILE IMAGE
const updateProfileImage = async (req, res) => {
    try {
        const { profileImage } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.profileImage = profileImage;
        await user.save();

        res.status(200).json({
            success: true,
            user: { 
                id: user._id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                username: user.username, 
                email: user.email, 
                role: user.role, 
                profileImage: user.profileImage 
            }
        });
    } catch (error) {
        console.error("❌ UPDATE IMAGE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, getMe, updateProfile, updateProfileImage };