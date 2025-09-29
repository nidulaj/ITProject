import { useState, useEffect } from 'react';
import { authFetchCustomer } from '../../user-management/utils/authFetchCustomer';
import { useCustomer } from '../../../contexts/CustomerContext';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});
  const [allOrderItems, setAllOrderItems] = useState({});
  const { currentCustomer } = useCustomer();

  const API_BASE_URL = 'http://localhost:5000/api/orders';

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentCustomer?.id) {
        setError('Customer not found');
        return;
      }

      const response = await authFetchCustomer({
        method: 'get',
        url: `${API_BASE_URL}/customer/${currentCustomer.id}`
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
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
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
          productMap[product.id] = product.name || product.product_name || `Product ${product.id}`;
        });
        console.log('Product map created:', productMap);
        setProducts(productMap);
      }
    } catch (error) {
      console.error('Error fetching product names:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading your orders...</div>
        </div>
      </div>
    );
  }

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

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentOrderItems = allOrderItems[order.order_id] || [];
              return (
                <div key={order.order_id} className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    {/* Header with Order ID and Date */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.order_id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.order_date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.total_price)}
                        </p>
                      </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Order Status</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Payment</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Order Items ({currentOrderItems.length})</span>
                      </div>
                      <div className="space-y-2">
                        {currentOrderItems.length > 0 ? (
                          currentOrderItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-600">{item.quantity}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {products[item.product_id] || `Product ${item.product_id}`}
                                  </p>
                                  <p className="text-xs text-gray-500">Unit: {formatPrice(item.price)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No items found for this order</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.delivery_address && (
                      <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">Delivery Address</span>
                        </div>
                        <p className="text-sm text-gray-600">{order.delivery_address}</p>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerOrders;
