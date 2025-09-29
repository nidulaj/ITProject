import React, { useState, useEffect } from 'react';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import {  X } from 'lucide-react';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await authFetch({
        method: 'get',
        url: 'http://localhost:5000/api/notifications', // API endpoint to fetch notifications
      });
      console.log('Fetched Notifications:', res.data); // Log the response to check if data is correct
      setNotifications(res?.data?.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-13 right-50 bg-white shadow-lg rounded-lg w-80 max-h-100 overflow-y-auto z-10">
      <div className="p-4 flex justify-between">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {/* Close button */}
        <button onClick={onClose} className="text-gray-500 text-sm">
            <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="divide-y">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications yet.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
            >
              <p className="text-sm font-medium">{notif.message}</p>
              <p className="text-xs text-gray-500">{notif.timeAgo}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
