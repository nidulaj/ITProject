import { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationIcon = ({ customerId = 1 }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api/notifications';

  // Fetch notifications and unread count
  useEffect(() => {
    if (customerId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [customerId]);

  // Auto-refresh notifications every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (customerId) {
        fetchUnreadCount();
        if (isOpen) {
          fetchNotifications();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [customerId, isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/customer/${customerId}`);
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/${customerId}/unread-count`);
      if (response.data.success) {
        const count = response.data.unread_count || 0;
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/${notificationId}/read`, {
        customer_id: customerId
      });
      // Refresh notifications and count
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/customer/${customerId}/read-all`);
      // Refresh notifications and count
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${notificationId}`, {
        data: { customer_id: customerId }
      });
      // Refresh notifications and count
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  return (
    <div className="relative">
      {/* Notification Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-blue-200 z-50 transform perspective-1000 hover:shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="px-4 py-3 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-800 drop-shadow-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    fetchUnreadCount();
                    fetchNotifications();
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium p-1 rounded-full hover:bg-gray-200 transition-all duration-200 transform hover:scale-110"
                  title="Refresh"
                >
                  🔄
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium px-2 py-1 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-105"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`px-4 py-3 hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md ${
                      !notification.is_read ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500' : 'hover:border-l-4 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => markAsRead(notification.notification_id)}
                      >
                        <p className={`text-sm ${
                          !notification.is_read 
                            ? 'text-gray-900 font-medium' 
                            : 'text-gray-600'
                        }`}>
                          {notification.notification}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            Order #{String(notification.order_id).padStart(3, '0')}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.notification_id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Delete notification"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-blue-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-blue-500 hover:text-blue-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationIcon;