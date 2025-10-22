// components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, subtitle, status, icon: Icon, bgColor = 'bg-white' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Average': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Good': return 'bg-green-100 text-green-800 border-green-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`${bgColor} rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <Icon className="text-gray-600" size={24} />
          </div>
        )}
      </div>
      
      {status && (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default StatCard;