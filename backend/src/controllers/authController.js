const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate jwt token
const generateToken = (id, role) => {
    return jwt.sign(
        { userId: id, role: role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// @desc Register new user
// @route POST/api/auth/register
// @access Public
const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword } = req.body;

        // Check if password match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Check if user already exists
        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
        });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
        }

        // Create user (Model auto-hashes password)
        const user = await User.create({
            firstName: firstName || '',
            lastName: lastName || '',
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: password,
        });

        // Generate token
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
                loyaltyPoints: user.loyaltyPoints,
            }
        });

    } catch (error) {
        console.error("❌ REGISTRATION ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Login user
// @route POST/api/auth/login
// @access Public
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        // Check if user exists (using email OR username)
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
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
                loyaltyPoints: user.loyaltyPoints,
                totalAppointments: user.totalAppointments,
            }
        });
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get current user profile
// @route GET/api/auth/me
// @access Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, getMe };