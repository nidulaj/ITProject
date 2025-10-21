import React, { useState } from 'react';

const OrderReportFilters = ({ onGenerateReport, generatingReport }) => {
  const [filters, setFilters] = useState({
    orderStatus: '',
    paymentStatus: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = () => {
    onGenerateReport(filters);
  };

  const handleReset = () => {
    setFilters({
      orderStatus: '',
      paymentStatus: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Order Report Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
          <select
            name="orderStatus"
            value={filters.orderStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="packing">Packing</option>
            <option value="out for delivery">Out for Delivery</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Reset Filters
        </button>
        <button
          onClick={handleGenerate}
          disabled={generatingReport}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            generatingReport 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
          }`}
        >
          {generatingReport ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="text-sm font-medium">
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default OrderReportFilters;