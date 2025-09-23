const express = require('express');
const router = express.Router();
const {
  createNotificationController,
  getCustomerNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotificationController
} = require('../controllers/notificationController');

// Create a new notification
router.post('/', createNotificationController);

// Get notifications for a customer
router.get('/customer/:customer_id', getCustomerNotifications);

// Get unread count for a customer
router.get('/customer/:customer_id/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:notification_id/read', markAsRead);

// Mark all notifications as read for a customer
router.put('/customer/:customer_id/read-all', markAllAsRead);

// Delete notification
router.delete('/:notification_id', deleteNotificationController);

module.exports = router;
