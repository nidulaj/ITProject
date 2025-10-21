import { useState, useEffect } from 'react';
import { authFetchCustomer } from '../../user-management/utils/authFetchCustomer';
import { useCustomer } from '../../../contexts/CustomerContext';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});
  const [allOrderItems, setAllOrderItems] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(null);
  const { currentCustomer } = useCustomer();

  const API_BASE_URL = 'http://localhost:5000/api/orders';

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      setError(null);
      
      console.log('Current customer in CustomerOrders:', currentCustomer);
      
      // Fetch all orders instead of customer-specific orders
      console.log('Fetching all orders');
      const response = await authFetchCustomer({
        method: 'get',
        url: `${API_BASE_URL}/all`
      });
      
      if (response.data.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
        
        // Fetch order items for each order
        const orderItemsPromises = ordersData.map(async (order) => {
          try {
            const itemsResponse = await authFetchCustomer({
              method: 'get',
              url: `${API_BASE_URL}/${order.order_id}`
            });
            return {
              orderId: order.order_id,
              items: itemsResponse.data.orderItems || []
            };
          } catch (error) {
            console.error(`Error fetching items for order ${order.order_id}:`, error);
            return { orderId: order.order_id, items: [] };
          }
        });
        
        const orderItemsResults = await Promise.all(orderItemsPromises);
        const orderItemsMap = {};
        orderItemsResults.forEach(result => {
          orderItemsMap[result.orderId] = result.items;
        });
        setAllOrderItems(orderItemsMap);
        
        // Fetch all product names once
        await fetchProductNames();
        
        // Debug: Log the order items to see what product data we have
        console.log('Order items data:', orderItemsMap);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      setError('Failed to fetch orders');
    }
  };

  const fetchProductNames = async () => {
    try {
      const response = await authFetchCustomer({
        method: 'get',
        url: 'http://localhost:5000/api/products'
      });
      
      console.log('Products API response:', response.data);
      
      if (response.data.products) {
        const productMap = {};
        response.data.products.forEach(product => {
          console.log('Product data:', product);
          // Map by product_id instead of id, and try multiple name fields
          const productId = product.product_id || product.id;
          const productName = product.name || product.product_name || product.title || `Product ${productId}`;
          productMap[productId] = productName;
        });
        console.log('Product map created:', productMap);
        setProducts(productMap);
      }
    } catch (error) {
      console.error('Error fetching product names:', error);
      // If bulk fetch fails, we'll try to fetch individual products as needed
      console.log('Bulk product fetch failed, will fetch individual products as needed');
    }
  };

  // Function to fetch individual product name if not found in bulk fetch
  const getProductName = async (productId) => {
    try {
      const response = await authFetchCustomer({
        method: 'get',
        url: `http://localhost:5000/api/products/${productId}`
      });
      
      if (response.data.product) {
        const product = response.data.product;
        return product.name || product.product_name || product.title || `Product ${productId}`;
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
    }
    return `Product ${productId}`;
  };

  // Function to handle eye icon click
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Function to generate PDF invoice
  const handleGenerateInvoice = async (orderId) => {
    try {
      setGeneratingPDF(orderId);
      console.log(`Generating PDF invoice for order ${orderId}`);
      console.log(`Current customer when generating PDF:`, currentCustomer);
      
      const response = await authFetchCustomer({
        method: 'get',
        url: `http://localhost:5000/api/orders/${orderId}/invoice`,
        responseType: 'blob' // Important for PDF files
      });
      
      console.log('PDF response received:', response);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`PDF invoice downloaded for order ${orderId}`);
    } catch (error) {
      console.error('Error generating PDF invoice:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to generate PDF invoice. ';
      if (error.response?.status === 404) {
        errorMessage += 'Order not found.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication required. Please log in again.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setGeneratingPDF(null);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'LKR 0.00';
    return `LKR ${parseFloat(price).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'packing': 'bg-purple-100 text-purple-800',
      'out for delivery': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };


  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchCustomerOrders}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 drop-shadow-lg">
              My Orders
            </h1>
            <p className="mt-2 text-gray-600">
              Track and manage your orders
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                  <p className="text-sm text-gray-600">{orders.length} orders found</p>
                </div>
              </div>
            </div>

            {/* Modern Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {orders.map((order) => {
                    const currentOrderItems = allOrderItems[order.order_id] || [];
                    return (
                      <tr key={order.order_id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                Order #{order.order_id}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(order.order_date)}
                              </div>
                              {order.delivery_address && (
                                <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                  📍 {order.delivery_address}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">{currentOrderItems.length}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {currentOrderItems.length > 0 ? (
                                <div className="max-w-xs">
                                  <div className="font-medium text-gray-900">
                                    {products[currentOrderItems[0].product_id] || 
                                     currentOrderItems[0].product_name || 
                                     `Product ${currentOrderItems[0].product_id}`}
                                  </div>
                                  {currentOrderItems.length > 1 && (
                                    <div className="text-xs text-gray-500">
                                      +{currentOrderItems.length - 1} more items
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">No items</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatPrice(order.total_price)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewOrderDetails(order)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:bg-white/80"
                              title="View order details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleGenerateInvoice(order.order_id)}
                              disabled={generatingPDF === order.order_id}
                              className={`p-2 rounded-lg transition-all duration-200 group-hover:bg-white/80 ${
                                generatingPDF === order.order_id 
                                  ? 'text-green-600 bg-green-50 cursor-not-allowed' 
                                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              }`}
                              title={generatingPDF === order.order_id ? "Generating PDF..." : "Generate PDF invoice"}
                            >
                              {generatingPDF === order.order_id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50/50 backdrop-blur-sm px-6 py-4 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {orders.length} of {orders.length} orders
                </div>
                <div className="flex items-center space-x-2">
                
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Order #{selectedOrder.order_id} Details
                      </h2>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedOrder.order_date)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Order Status */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Order Status</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.order_status)}`}>
                      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                      {selectedOrder.order_status}
                    </span>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Payment Status</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-700">
                      Order Items ({allOrderItems[selectedOrder.order_id]?.length || 0})
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {allOrderItems[selectedOrder.order_id]?.length > 0 ? (
                      allOrderItems[selectedOrder.order_id].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">{item.quantity}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">
                                {products[item.product_id] || 
                                 item.product_name || 
                                 `Product ${item.product_id}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                Unit Price: {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-gray-500">No items found for this order</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.delivery_address && (
                  <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">Delivery Address</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedOrder.delivery_address}</p>
                  </div>
                )}

                {/* Order Total */}
                <div className="mt-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Order Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(selectedOrder.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerOrders;
