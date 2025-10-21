import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const OrderStats = ({ stats, orders }) => {
  // Prepare data for order status pie chart
  const orderStatusData = [
    { name: 'Pending', value: stats.pendingOrders || 0 },
    { name: 'Processing', value: stats.processingOrders || 0 },
    { name: 'Packing', value: stats.packingOrders || 0 },
    { name: 'Out for Delivery', value: stats.deliveryOrders || 0 },
  ];

  // Prepare data for payment status pie chart
  const paymentStatusData = orders.reduce((acc, order) => {
    const status = order.payment_status || 'unknown';
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []);

  const ORDER_COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];
  const PAYMENT_COLORS = ['#ef4444', '#10b981', '#f59e0b', '#6b7280'];

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

  // Custom tooltip for payment status
  const PaymentTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = paymentStatusData.reduce((sum, item) => sum + item.value, 0);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
      {/* Order Status Pie Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Order Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ value }) => value}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ORDER_COLORS[index % ORDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Status Pie Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Payment Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ value }) => value}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PaymentTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
