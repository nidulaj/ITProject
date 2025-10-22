const {
  createNotification,
  getNotificationsByCustomer,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} = require('../models/notificationModel');

// Create a new notification
const createNotificationController = async (req, res) => {
  try {
    const { cus_id, customer_id, order_id, notification, notification_type } = req.body;
    const customerId = cus_id || customer_id; // Support both field names
    
    if (!customerId || !notification) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID and notification message are required'
      });
    }

    const newNotification = await createNotification(
      customerId, 
      order_id, 
      notification, 
      notification_type || 'order_update'
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: newNotification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
      details: error.message
    });
  }
};

// Get notifications for a customer
const getCustomerNotifications = async (req, res) => {
  try {
    const { customer_id } = req.params;
    
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }

    const notifications = await getNotificationsByCustomer(customer_id);
    const unreadCount = await getUnreadNotificationsCount(customer_id);

    res.status(200).json({
      success: true,
      notifications: notifications,
      unreadCount: unreadCount
    });
  } catch (error) {
    console.error('Error fetching customer notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      details: error.message
    });
  }
};

// Get unread count for a customer
const getUnreadCount = async (req, res) => {
  try {
    const { customer_id } = req.params;
    
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }

    const unreadCount = await getUnreadNotificationsCount(customer_id);

    res.status(200).json({
      success: true,
      unread_count: unreadCount
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unread count',
      details: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { cus_id, customer_id } = req.body;
    const customerId = cus_id || customer_id; // Support both field names

    if (!notification_id || !customerId) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID and Customer ID are required'
      });
    }

    const updatedNotification = await markNotificationAsRead(notification_id, customerId);

    if (!updatedNotification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      details: error.message
    });
  }
};

// Mark all notifications as read for a customer
const markAllAsRead = async (req, res) => {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }

    const updatedNotifications = await markAllNotificationsAsRead(customer_id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: updatedNotifications.length
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      details: error.message
    });
  }
};

// Delete notification
const deleteNotificationController = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { cus_id, customer_id } = req.body;
    const customerId = cus_id || customer_id; // Support both field names

    if (!notification_id || !customerId) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID and Customer ID are required'
      });
    }

    const deletedNotification = await deleteNotification(notification_id, customerId);

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      notification: deletedNotification
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      details: error.message
    });
  }
};

module.exports = {
  createNotificationController,
  getCustomerNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotificationController
};
