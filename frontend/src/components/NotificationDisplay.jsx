import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyles = (type) => {
    const baseStyles = "fixed top-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 mb-4 transform transition-all duration-300 ease-in-out";
    
    // Position based on notification type - both success and info go to left
    const positionClass = (type === 'success' || type === 'info') ? 'left-4' : 'right-4';
    
    switch (type) {
      case 'success':
        return `${baseStyles} ${positionClass} border-green-500 bg-green-50`;
      case 'error':
        return `${baseStyles} ${positionClass} border-red-500 bg-red-50`;
      case 'warning':
        return `${baseStyles} ${positionClass} border-yellow-500 bg-yellow-50`;
      case 'info':
        return `${baseStyles} ${positionClass} border-blue-500 bg-blue-50`;
      default:
        return `${baseStyles} ${positionClass} border-gray-500 bg-gray-50`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={getNotificationStyles(notification.type)}
            style={{
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-lg">{getIcon(notification.type)}</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>
    </>
  );
};

export default NotificationDisplay;
