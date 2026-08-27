const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updateProfileImage } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/update', authenticate, updateProfile);
router.put('/update-profile-image', authenticate, updateProfileImage);

module.exports = router;