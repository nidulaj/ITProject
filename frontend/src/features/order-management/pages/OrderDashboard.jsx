import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import ProductCatalog from './ProductCatalog';
import NotificationProvider from '../../../contexts/NotificationContext';
import OrderStats from '../components/OrderStats';
import OrderTable from '../components/OrderTable';
import OrderDetailsModal from '../components/OrderDetailsModal';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserProfile from '../../user-management/components/UserProfile';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    packingOrders: 0,
    deliveryOrders: 0,
    pendingPayments: 0
  });

  const API_BASE_URL = 'http://localhost:5000/api/orders';

  useEffect(() => {
    fetchOrders();
    fetchUserInfo();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const fetchUserInfo = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/staff/auth/userInfo",
      });
      setUserInfo(res.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

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
      setError(null);
      console.log('Fetching orders from API...');

      const res = await authFetch({
        method: 'get',
        url: `${API_BASE_URL}/all`
      });
      console.log('API Response:', res.data);

      if (res.data.success) {
        setOrders(res.data.orders || []);
        console.log(`Loaded ${res.data.orders?.length || 0} orders`);
      } else {
        setError(`Server error: ${res.data.error || 'Unknown error'}`);
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
    }
  };

  const handleViewOrderDetails = async (order) => {
    try {
      setSelectedOrder(order);
      setShowOrderDetails(true);
      
      console.log(`Fetching details for order ${order.order_id}`);
      
      const res = await authFetch({
        method: 'get',
        url: `${API_BASE_URL}/${order.order_id}`
      });
      
      if (res.data.success) {
        setOrderItems(res.data.orderItems || []);
        console.log('Order items:', res.data.orderItems);
      } else {
        console.error('Failed to fetch order items:', res.data.error);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
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
      
      const res = await authFetch({
        method: 'put',
        url: `${API_BASE_URL}/${orderId}/status`,
        data: {
          order_status: newStatus
        }
      });
      
      if (res.data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.order_id === orderId 
              ? { ...order, order_status: newStatus }
              : order
          )
        );
        
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status:', res.data.error);
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
      
      const res = await authFetch({
        method: 'delete',
        url: `${API_BASE_URL}/${orderId}`
      });
      
      if (res.data.success) {
        setOrders(prevOrders => 
          prevOrders.filter(order => order.order_id !== orderId)
        );
        console.log(`Order ${orderId} deleted successfully`);
      } else {
        console.error('Failed to delete order:', res.data.error);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };



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
    <NotificationProvider>
      <Routes>
        <Route path="/" element={
          <div className="flex min-h-screen">
            {/* Left sidebar navigation */}
            <Sidebar />

            {/* Main content */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen">
              {/* Header */}
              <Header userInfo={userInfo} />
              
              <div className="p-6">
                {/* Header for main content */}
                <div className="mb-8 text-center">
                  
                </div>

              {/* Order Statistics */}
              <OrderStats stats={stats} />

              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-200 transform perspective-1000 hover:shadow-xl transition-all duration-300">
                <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <h2 className="text-xl font-semibold text-blue-800 drop-shadow-sm">Recent Orders</h2>
                </div>
                
                <OrderTable 
                  orders={orders} 
                  error={error} 
                  fetchOrders={fetchOrders} 
                  formatPrice={formatPrice} 
                  formatDate={formatDate} 
                  handleViewOrderDetails={handleViewOrderDetails} 
                  handleUpdateOrderStatus={handleUpdateOrderStatus} 
                  handleDeleteOrder={handleDeleteOrder} 
                />
              </div>

                {/* Order Details Modal */}
                <OrderDetailsModal 
                  showOrderDetails={showOrderDetails} 
                  selectedOrder={selectedOrder} 
                  orderItems={orderItems} 
                  handleCloseOrderDetails={handleCloseOrderDetails} 
                  formatDate={formatDate} 
                  formatPrice={formatPrice} 
                />
              </div>
            </div>
          </div>
        } />
        <Route path="/products/*" element={<ProductCatalog />} />
        <Route path="/profile" element={
          <div className="flex min-h-screen">
            {/* Left sidebar navigation */}
            <Sidebar />

            {/* Main content */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen">
              {/* Header */}
              <Header userInfo={userInfo} />
              
              <div className="p-6">
                <UserProfile userInfo={userInfo} />
              </div>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
};




export default OrderDashboard;
