import React from 'react';

const OrderDetailsModal = ({ 
  showOrderDetails, 
  selectedOrder, 
  orderItems, 
  handleCloseOrderDetails, 
  formatDate, 
  formatPrice 
}) => {
  if (!showOrderDetails || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform perspective-1000 hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">
            Order #{String(selectedOrder.order_id).padStart(3, '0')} Details
          </h3>
          <button
            onClick={handleCloseOrderDetails}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Order Information */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-gray-800 mb-3">Order Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer ID:</p>
                <p className="text-sm font-semibold">#{String(selectedOrder.cus_id).padStart(3, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date:</p>
                <p className="text-sm font-semibold">{formatDate(selectedOrder.order_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status:</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedOrder.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedOrder.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedOrder.payment_status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Status:</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedOrder.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedOrder.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.order_status === 'packing' ? 'bg-purple-100 text-purple-800' :
                  selectedOrder.order_status === 'out for delivery' ? 'bg-green-100 text-green-800' :
                  selectedOrder.order_status === 'completed' ? 'bg-green-200 text-green-800' :
                  selectedOrder.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedOrder.order_status}
                </span>
              </div>
              {/* Delivery Address */}
              {selectedOrder.delivery_address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Delivery Address:</p>
                  <p className="text-sm font-semibold whitespace-pre-wrap">{selectedOrder.delivery_address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3">Order Items</h4>
            
            {orderItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No items found for this order.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          #{String(item.product_id).padStart(3, '0')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Total */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-blue-600">{formatPrice(selectedOrder.total_price)}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={handleCloseOrderDetails}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;