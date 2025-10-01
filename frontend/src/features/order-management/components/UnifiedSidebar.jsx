import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UnifiedSidebar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      id: 'products',
      label: 'Product Management',
      path: '/dashboard/order/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'Order Management',
      path: '/dashboard/order',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-64 bg-white shadow-2xl fixed h-full transform perspective-1000 z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform rotate-x-1">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">{title}</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 hover:shadow-md'
              }`}
            >
              <div className="text-xl">
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* Create New Product Button */}
          <button
            onClick={() => {
              // Navigate to products page and trigger create modal
              navigate('/dashboard/order/products');
              // Dispatch a custom event to trigger the create modal
              window.dispatchEvent(new CustomEvent('openCreateProductModal'));
            }}
            className="w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
          >
            <div className="text-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-medium">Create New Product</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 PUBUD Yogurt</p>
            <p>Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSidebar;
