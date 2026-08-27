const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { 
    getMyNotifications, 
    markAsRead, 
    deleteNotification, 
    markAllAsRead 
} = require('../controllers/notificationController');

// All routes are protected
router.get('/', authenticate, getMyNotifications);
router.put('/read/:id', authenticate, markAsRead);
router.put('/read-all', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);

module.exports = router;