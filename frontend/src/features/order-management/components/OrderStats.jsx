import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const OrderStats = ({ stats, orders }) => {
  // Prepare data for pie chart
  const orderStatusData = [
    { name: 'Pending', value: stats.pendingOrders || 0 },
    { name: 'Processing', value: stats.processingOrders || 0 },
    { name: 'Packing', value: stats.packingOrders || 0 },
    { name: 'Out for Delivery', value: stats.deliveryOrders || 0 },
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];

  // Custom tooltip to show percentages
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded">
          <p className="font-semibold">{data.name}</p>
          <p>Count: {data.value}</p>
          <p>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Total Orders Card */}
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">Total Orders</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
            <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-200 text-green-900 mt-1">Good</span>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Pending Payments Card */}
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font- text-gray-600">Pending Payments</p>
            <p className="text-xl font-bold text-gray-900">{stats.pendingPayments}</p>
            <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full mt-1 ${stats.pendingPayments > 0 ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>
              {stats.pendingPayments > 0 ? "Warning" : "Good"}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-300 text-white">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Order Status Pie Chart */}
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 lg:col-span-1">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '8px', fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;