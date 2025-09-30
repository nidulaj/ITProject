import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { authFetchCustomer } from '../features/user-management/utils/authFetchCustomer';

const NotificationIcon = ({ customerId = 1 }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api/notifications';

  // Debug customer ID
  console.log('🔔 NotificationIcon - customerId:', customerId);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (customerId) {
      console.log('🔌 Initializing Socket.IO connection for customer:', customerId);
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket.IO connected:', newSocket.id);
        // Join customer room for notifications
        newSocket.emit('join_customer_room', customerId);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket.IO disconnected');
      });

      newSocket.on('new_notification', (data) => {
        console.log('🔔 Real-time notification received:', data);
        // Add new notification to the list
        setNotifications(prev => [data.notification, ...prev]);
        // Update unread count
        setUnreadCount(prev => prev + 1);
        // Show a browser notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification('New Order Update', {
            body: data.message,
            icon: '/favicon.ico'
          });
        }
      });

      setSocket(newSocket);

      return () => {
        console.log('🔌 Cleaning up Socket.IO connection');
        newSocket.emit('leave_customer_room', customerId);
        newSocket.disconnect();
      };
    }
  }, [customerId]);

  // Fetch notifications and unread count
  useEffect(() => {
    if (customerId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [customerId]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('Fetching notifications for customer:', customerId);
      
      let response;
      try {
        console.log('🔔 Trying authenticated request first...');
        // Try authenticated request first
        response = await authFetchCustomer({
          method: 'get',
          url: `${API_BASE_URL}/customer/${customerId}`
        });
        console.log('✅ Auth request successful:', response.data);
      } catch (authError) {
        console.log('❌ Auth request failed, trying direct axios:', authError);
        // Fallback to direct axios call
        response = await axios.get(`${API_BASE_URL}/customer/${customerId}`);
        console.log('✅ Direct axios request successful:', response.data);
      }
      
      console.log('Notifications response:', response.data);
      if (response.data.success) {
        const notifications = response.data.notifications || [];
        setNotifications(notifications);
        console.log('✅ Notifications loaded:', notifications.length);
        console.log('📋 Notification details:', notifications);
      } else {
        console.log('❌ Failed to load notifications:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      console.log('Fetching unread count for customer:', customerId);
      
      let response;
      try {
        console.log('🔔 Trying authenticated request for unread count...');
        // Try authenticated request first
        response = await authFetchCustomer({
          method: 'get',
          url: `${API_BASE_URL}/customer/${customerId}/unread-count`
        });
        console.log('✅ Auth request for unread count successful:', response.data);
      } catch (authError) {
        console.log('❌ Auth request for unread count failed, trying direct axios:', authError);
        // Fallback to direct axios call
        response = await axios.get(`${API_BASE_URL}/customer/${customerId}/unread-count`);
        console.log('✅ Direct axios request for unread count successful:', response.data);
      }
      
      console.log('Unread count response:', response.data);
      if (response.data.success) {
        const count = response.data.unread_count || 0;
        setUnreadCount(count);
        console.log('✅ Unread count loaded:', count);
      } else {
        console.log('❌ Failed to load unread count:', response.data);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);
      await authFetchCustomer({
        method: 'put',
        url: `${API_BASE_URL}/${notificationId}/read`,
        data: { customer_id: customerId }
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
      console.log('Marking all notifications as read for customer:', customerId);
      await authFetchCustomer({
        method: 'put',
        url: `${API_BASE_URL}/customer/${customerId}/read-all`
      });
      // Refresh notifications and count
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      console.log('Deleting notification:', notificationId);
      await authFetchCustomer({
        method: 'delete',
        url: `${API_BASE_URL}/${notificationId}`,
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
    console.log('🔔 Toggling dropdown, current state:', isOpen);
    setIsOpen(!isOpen);
    if (!isOpen) {
      console.log('🔔 Fetching notifications on dropdown open');
      fetchNotifications();
    }
  };

  // Test function to create a notification (for debugging)
  const createTestNotification = async () => {
    try {
      console.log('Creating test notification for customer:', customerId);
      const response = await authFetchCustomer({
        method: 'post',
        url: `${API_BASE_URL}`,
        data: {
          customer_id: customerId,
          order_id: 999,
          notification: 'Test notification - Order #999 status updated to confirmed.',
          notification_type: 'order_update'
        }
      });
      console.log('Test notification created:', response.data);
      
      // Emit test notification via Socket.IO
      if (socket) {
        socket.emit('new_notification', {
          notification: response.data.notification,
          message: 'Test notification - Order #999 status updated to confirmed.',
          order_id: 999,
          customer_id: customerId
        });
        console.log('🚀 Test notification emitted via Socket.IO');
      }
      
      // Refresh notifications
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error creating test notification:', error);
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
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-blue-800 drop-shadow-sm">Notifications</h3>
                {socket && socket.connected ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Real-time connected"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full" title="Real-time disconnected"></div>
                )}
              </div>
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
                <button
                  onClick={createTestNotification}
                  className="text-green-500 hover:text-green-700 text-sm font-medium p-1 rounded-full hover:bg-green-200 transition-all duration-200 transform hover:scale-110"
                  title="Create Test Notification"
                >
                  🧪
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
                        className="flex-1"
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