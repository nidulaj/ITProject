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
    const { customer_id, order_id, notification, notification_type } = req.body;
    
    console.log('Creating notification:', { customer_id, order_id, notification, notification_type });
    
    if (!customer_id || !order_id || !notification) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID, Order ID, and notification message are required' 
      });
    }
    
    const newNotification = await createNotification(customer_id, order_id, notification, notification_type);
    
    console.log('Notification created successfully:', newNotification);
    
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
    
    console.log(`Fetching notifications for customer ID: ${customer_id}`);
    
    if (!customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID is required' 
      });
    }

    const notifications = await getNotificationsByCustomer(customer_id);
    
    console.log(`Retrieved ${notifications.length} notifications for customer ${customer_id}`);
    
    res.status(200).json({ 
      success: true,
      notifications: notifications,
      count: notifications.length
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

// Get unread notifications count
const getUnreadCount = async (req, res) => {
  try {
    const { customer_id } = req.params;
    
    if (!customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID is required' 
      });
    }

    const count = await getUnreadNotificationsCount(customer_id);
    
    res.status(200).json({ 
      success: true,
      unread_count: count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get unread count',
      details: error.message 
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { customer_id } = req.body;
    
    if (!notification_id || !customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Notification ID and Customer ID are required' 
      });
    }

    const notification = await markNotificationAsRead(notification_id, customer_id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        error: 'Notification not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Notification marked as read',
      notification: notification
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

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { customer_id } = req.params;
    
    if (!customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID is required' 
      });
    }

    const notifications = await markAllNotificationsAsRead(customer_id);
    
    res.status(200).json({ 
      success: true,
      message: 'All notifications marked as read',
      updated_count: notifications.length
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
    const { customer_id } = req.body;
    
    if (!notification_id || !customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Notification ID and Customer ID are required' 
      });
    }

    const notification = await deleteNotification(notification_id, customer_id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        error: 'Notification not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Notification deleted successfully',
      notification: notification
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