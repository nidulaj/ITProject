import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-64 bg-white shadow-2xl fixed h-full transform perspective-1000">
      <div className="flex flex-col h-full">
        <div className="p-6 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform rotate-x-1">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">Order Management</h1>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <button 
            onClick={() => navigate('/dashboard/order/products')}
            className="w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 hover:shadow-md"
          >
            <div className="text-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-medium">Manage Products</span>
          </button>
          
          <button className="w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 hover:shadow-md">
            <div className="text-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-medium">Export Report</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
