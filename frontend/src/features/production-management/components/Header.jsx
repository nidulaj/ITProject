// components/Header.jsx
import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = ({
  title = "Production Manager Dashboard",
  pendingCount = 0,
  onOpenNotifications = () => {},
}) => {
  const hasPending = Number(pendingCount) > 0;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Pending customized orders"
          >
            <Bell size={20} />
            <span
              className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center ${
                hasPending ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          {/* User Profile */}
          <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <div className="bg-gray-300 rounded-full p-2">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">Production Manager</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
