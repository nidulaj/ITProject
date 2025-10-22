import React from 'react';

const OrderTable = ({ 
  orders, 
  error, 
  fetchOrders, 
  formatPrice, 
  formatDate, 
  handleViewOrderDetails, 
  handleUpdateOrderStatus, 
  handleDeleteOrder 
}) => {

  if (error) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Error Loading Dashboard</h3>
            <p className="text-sm text-blue-700 mt-1">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500">No orders found in the database. Orders will appear here once customers place them.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-200">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-blue-100">
          {orders.map((order, index) => (
            <tr key={order.order_id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 hover:shadow-md transition-all duration-200 transform hover:scale-[1.01]`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{String(order.order_id).padStart(3, '0')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                #{String(order.cus_id).padStart(3, '0')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                {formatPrice(order.total_price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.payment_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.order_status === 'packing' ? 'bg-purple-100 text-purple-800' :
                  order.order_status === 'out for delivery' ? 'bg-green-100 text-green-800' :
                  order.order_status === 'completed' ? 'bg-green-200 text-green-800' :
                  order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.order_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.order_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewOrderDetails(order)}
                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200 transform hover:scale-110 hover:shadow-md border border-blue-200 hover:border-blue-300"
                    title="View Order Details"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <select
                    value={order.order_status}
                    onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value)}
                    className="text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="packing">Packing</option>
                    <option value="out for delivery">Out for Delivery</option>
                  </select>
                  
                  <button
                    onClick={() => handleDeleteOrder(order.order_id)}
                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors duration-200"
                    title="Delete Order"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
