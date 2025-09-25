const { pool } = require('../db/dbConnect');

// Create a new notification
const createNotification = async (cus_id, order_id, notification, notification_type = 'order_update') => {
  try {
    const result = await pool.query(
      'INSERT INTO notifications (cus_id, order_id, notification, notification_type, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [cus_id, order_id, notification, notification_type]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get all notifications for a customer
const getNotificationsByCustomer = async (cus_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE cus_id = $1 ORDER BY created_at DESC',
      [cus_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching notifications by customer:', error);
    throw error;
  }
};

// Get unread notifications count for a customer
const getUnreadNotificationsCount = async (cus_id) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE cus_id = $1 AND is_read = FALSE',
      [cus_id]
    );
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
};

// Mark notification as read
const markNotificationAsRead = async (notification_id, cus_id) => {
  try {
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE notification_id = $1 AND cus_id = $2 RETURNING *',
      [notification_id, cus_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read for a customer
const markAllNotificationsAsRead = async (cus_id) => {
  try {
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE cus_id = $1 AND is_read = FALSE RETURNING *',
      [cus_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete a notification
const deleteNotification = async (notification_id, cus_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM notifications WHERE notification_id = $1 AND cus_id = $2 RETURNING *',
      [notification_id, cus_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotificationsByCustomer,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};




