import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    packingOrders: 0,
    deliveryOrders: 0,
    pendingPayments: 0
  });

  const API_BASE_URL = 'http://localhost:5000/api/orders';

  // Fetch all orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate statistics whenever orders change
  useEffect(() => {
    calculateStats();
  }, [orders]);

  const calculateStats = () => {
    const totalOrders = orders.length;
    const packingOrders = orders.filter(order => order.order_status === 'packing').length;
    const deliveryOrders = orders.filter(order => order.order_status === 'out for delivery').length;
    const pendingPayments = orders.filter(order => order.payment_status === 'pending').length;

    setStats({
      totalOrders,
      packingOrders,
      deliveryOrders,
      pendingPayments
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders from API...');
      
      const response = await axios.get(`${API_BASE_URL}/all`);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
        console.log(`Loaded ${response.data.orders?.length || 0} orders`);
      } else {
        setError(`Server error: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error.response) {
        setError(`Server error ${error.response.status}: ${error.response.data?.error || error.message}`);
      } else if (error.request) {
        setError('Network error: Unable to connect to server');
      } else {
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = async (order) => {
    try {
      setLoadingOrderDetails(true);
      setSelectedOrder(order);
      setShowOrderDetails(true);
      
      console.log(`Fetching details for order ${order.order_id}`);
      
      const response = await axios.get(`${API_BASE_URL}/${order.order_id}`);
      
      if (response.data.success) {
        setOrderItems(response.data.orderItems || []);
        console.log('Order items:', response.data.orderItems);
      } else {
        console.error('Failed to fetch order items:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
    setOrderItems([]);
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

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} status to: ${newStatus}`);
      
      const currentOrder = orders.find(order => order.order_id === orderId);
      if (!currentOrder) {
        console.error('Order not found for notification creation');
        return;
      }
      
      const response = await axios.put(`${API_BASE_URL}/${orderId}/status`, {
        order_status: newStatus
      });
      
      if (response.data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.order_id === orderId 
              ? { ...order, order_status: newStatus }
              : order
          )
        );
        
        try {
          const notificationMessage = `Your order #${String(orderId).padStart(3, '0')} status has been updated to "${newStatus}".`;
          
          await axios.post('http://localhost:5000/api/notifications', {
            customer_id: currentOrder.customer_id,
            order_id: orderId,
            notification: notificationMessage,
            notification_type: 'order_update'
          });
          
          console.log(`Notification sent to customer ${currentOrder.customer_id} for order ${orderId}`);
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
        
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${String(orderId).padStart(3, '0')}? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log(`Deleting order ${orderId}`);
      
      const response = await axios.delete(`${API_BASE_URL}/${orderId}`);
      
      if (response.data.success) {
        setOrders(prevOrders => 
          prevOrders.filter(order => order.order_id !== orderId)
        );
        console.log(`Order ${orderId} deleted successfully`);
      } else {
        console.error('Failed to delete order:', response.data.error);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'refresh':
        fetchOrders();
        break;
      case 'products':
        // Navigate to the admin panel for product management
        window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'admin' } }));
        break;
      case 'export':
        console.log('Export orders functionality');
        break;
      case 'filter':
        console.log('Filter orders functionality');
        break;
      default:
        break;
    }
  };

  const StatCard = ({ title, value, subtitle, status, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-100 to-blue-200',
      primary: 'from-blue-500 to-blue-600',
      gray: 'from-gray-100 to-gray-200',
      white: 'from-white to-gray-50',
      light: 'from-blue-50 to-blue-100',
      green: 'from-green-100 to-green-200',
      yellow: 'from-yellow-100 to-yellow-200',
      red: 'from-red-100 to-red-200',
      purple: 'from-purple-100 to-purple-200'
    };

    const statusClasses = {
      'Low': 'bg-yellow-100 text-yellow-800',
      'Average': 'bg-blue-100 text-blue-800',
      'Good': 'bg-green-100 text-green-800',
      'High': 'bg-red-100 text-red-800',
      'Normal': 'bg-gray-100 text-gray-800'
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
            {status && (
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                statusClasses[status] || statusClasses['Normal']
              }`}>
                {status}
              </span>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const NavLink = ({ title, icon, isActive = false, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'}`}
      >
        <div className="text-xl">{icon}</div>
        <span className="font-medium">{title}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management Dashboard</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management Dashboard</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar navigation */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="flex flex-col h-full">
          <div className="p-6 mb-4 bg-blue-500">
            <h1 className="text-xl font-bold text-white">Order Management</h1>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">

            <NavLink 
              title="Manage Products" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>}
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'admin' } }))}
            />
            
            <NavLink 
              title="Customer Shop" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>}
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'customer' } }))}
            />
            

            <NavLink 
              title="Export Report" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>}
              onClick={() => handleQuickAction('export')}
            />
            
            <NavLink 
              title="Filter Orders" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>}
              onClick={() => handleQuickAction('filter')}
            />
          </nav>


        </div>
      </div>

      {/* Main content */}
      <div className="bg-gray-50 ml-64 w-full min-h-screen p-6">

        {/* Header for main content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor and manage all customer orders</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            subtitle="All Orders"
            status="Good"
            color="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          
          {/* Replaced Processing Orders with Pending Payments */}
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            subtitle="Awaiting Payment"
            status={stats.pendingPayments > 0 ? "Warning" : "Good"}
            color="yellow"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Packing"
            value={stats.packingOrders}
            subtitle="Ready to Pack"
            status="Good"
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          
          <StatCard
            title="Out for Delivery"
            value={stats.deliveryOrders}
            subtitle="In Transit"
            status="Good"
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading orders...</p>
              </div>
            </div>
          ) : error ? (
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
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">No orders found in the database. Orders will appear here once customers place them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 10).map((order, index) => (
                    <tr key={order.order_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{String(order.order_id).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{String(order.customer_id).padStart(3, '0')}
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
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors duration-200"
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
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
                      <p className="text-sm font-semibold">#{String(selectedOrder.customer_id).padStart(3, '0')}</p>
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
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">Order Items</h4>
                  
                  {loadingOrderDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : orderItems.length === 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default OrderManagementDashboard;