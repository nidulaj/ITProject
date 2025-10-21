import React from 'react';

const OrderStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform perspective-1000 hover:rotate-y-2 card-3d">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1 drop-shadow-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-md">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500 mb-3">All Orders</p>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow-md bg-green-200 text-green-900">Good</span>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform hover:scale-110 transition-transform duration-200 flex items-center justify-center stat-icon border border-white border-opacity-20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform perspective-1000 hover:rotate-y-2 card-3d">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1 drop-shadow-sm">Pending Payments</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-md">{stats.pendingPayments}</p>
            <p className="text-sm text-gray-500 mb-3">Awaiting Payment</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow-md ${stats.pendingPayments > 0 ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>
              {stats.pendingPayments > 0 ? "Warning" : "Good"}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-300 text-white shadow-lg transform hover:scale-110 transition-transform duration-200 flex items-center justify-center stat-icon border border-white border-opacity-20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform perspective-1000 hover:rotate-y-2 card-3d">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1 drop-shadow-sm">Packing</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-md">{stats.packingOrders}</p>
            <p className="text-sm text-gray-500 mb-3">Ready to Pack</p>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow-md bg-green-200 text-green-900">Good</span>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-200 to-purple-300 text-white shadow-lg transform hover:scale-110 transition-transform duration-200 flex items-center justify-center stat-icon border border-white border-opacity-20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform perspective-1000 hover:rotate-y-2 card-3d">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1 drop-shadow-sm">Out for Delivery</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-md">{stats.deliveryOrders}</p>
            <p className="text-sm text-gray-500 mb-3">In Transit</p>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow-md bg-green-200 text-green-900">Good</span>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-200 to-green-300 text-white shadow-lg transform hover:scale-110 transition-transform duration-200 flex items-center justify-center stat-icon border border-white border-opacity-20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
