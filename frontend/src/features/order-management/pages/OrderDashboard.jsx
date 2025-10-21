import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import ProductCatalog from './ProductCatalog';
import NotificationProvider from '../../../contexts/NotificationContext';
import OrderStats from '../components/OrderStats';
import OrderTable from '../components/OrderTable';
import OrderDetailsModal from '../components/OrderDetailsModal';
import UnifiedSidebar from '../components/UnifiedSidebar';
import Header from '../components/Header';
import UserProfile from '../../user-management/components/UserProfile';
import OrderStatusChart from '../components/OrderStatusChart';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    packingOrders: 0,
    deliveryOrders: 0,
    pendingPayments: 0
  });
  
  // State for report filters
  const [showReportFilters, setShowReportFilters] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    paymentStatus: '',
    customerId: ''
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
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response) {
        setError(`Server error ${error.response.status}: ${error.response.data?.error || error.message}`);
      } else if (error.request) {
        setError('Network error: Unable to connect to server');
      } else {
        setError(`Request error: ${error.message}`);
      }
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

  const handleViewOrderDetails = async (order) => {
    try {
      setSelectedOrder(order);
      setShowOrderDetails(true);
      
      // Fetch order items
      const res = await authFetch({
        method: 'get',
        url: `${API_BASE_URL}/${order.order_id}`
      });
      
      if (res.data.success) {
        setOrderItems(res.data.orderItems || []);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderItems([]);
    }
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} status to: ${newStatus}`);
      
      // Get the order details to find the customer_id
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
      
      console.log('Order status updated:', res.data);
      
      if (res.data.success) {
        // Update the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.order_id === orderId 
              ? { ...order, order_status: newStatus }
              : order
          )
        );
        
        // Notification is automatically created by the backend when order status is updated
        
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      console.log(`Deleting order ${orderId}`);
      
      const res = await authFetch({
        method: 'delete',
        url: `${API_BASE_URL}/${orderId}`
      });
      
      console.log('Order delete response:', res.data);
      
      if (res.data.success) {
        // Update the local state
        setOrders(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
        console.log(`Order ${orderId} deleted successfully`);
      } else {
        console.error('Failed to delete order:', res.data.error);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Function to generate order summary report
  const handleGenerateOrderSummaryReport = async () => {
    try {
      setGeneratingReport(true);
      console.log('Generating order summary report with filters:', reportFilters);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (reportFilters.startDate) queryParams.append('startDate', reportFilters.startDate);
      if (reportFilters.endDate) queryParams.append('endDate', reportFilters.endDate);
      if (reportFilters.status) queryParams.append('status', reportFilters.status);
      if (reportFilters.paymentStatus) queryParams.append('paymentStatus', reportFilters.paymentStatus);
      if (reportFilters.customerId) queryParams.append('customerId', reportFilters.customerId);
      
      const url = `${API_BASE_URL}/summary/report${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await authFetch({
        method: 'get',
        url: url,
        responseType: 'blob' // Important for PDF files
      });
      
      console.log('Order summary report response received:', response);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `order-summary-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
      
      console.log('Order summary report downloaded successfully');
    } catch (error) {
      console.error('Error generating order summary report:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to generate order summary report. ';
      if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication required. Please log in again.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Function to handle report filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setReportFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to reset filters
  const resetFilters = () => {
    setReportFilters({
      startDate: '',
      endDate: '',
      status: '',
      paymentStatus: '',
      customerId: ''
    });
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
            <UnifiedSidebar title="Order Management" />

            {/* Main content */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen">
              {/* Header */}
              <Header userInfo={userInfo} />
              
              <div className="p-6">
                {/* Header for main content */}
                <div className="mb-8 text-center">
                  
                </div>

              {/* Order Statistics and Chart */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Orders Card */}
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
                
                {/* Pending Payments Card */}
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
                
                {/* Order Status Chart */}
                <OrderStatusChart orders={orders} />
              </div>

              {/* Report Filters Modal */}
              {showReportFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Report Filters</h3>
                      <button 
                        onClick={() => setShowReportFilters(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={reportFilters.startDate}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={reportFilters.endDate}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                        <select
                          name="status"
                          value={reportFilters.status}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packing">Packing</option>
                          <option value="out for delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                          name="paymentStatus"
                          value={reportFilters.paymentStatus}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Payment Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                        <input
                          type="text"
                          name="customerId"
                          value={reportFilters.customerId}
                          onChange={handleFilterChange}
                          placeholder="Enter customer ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Reset
                      </button>
                      <div className="space-x-2">
                        <button
                          onClick={() => setShowReportFilters(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowReportFilters(false);
                            handleGenerateOrderSummaryReport();
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Generate Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-200 transform perspective-1000 hover:shadow-xl transition-all duration-300">
                <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-800 drop-shadow-sm">Recent Orders</h2>
                    <button
                      onClick={() => setShowReportFilters(true)}
                      disabled={generatingReport}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        generatingReport 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                      }`}
                      title={generatingReport ? "Generating report..." : "Generate Order Summary Report"}
                    >
                      {generatingReport ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium">
                        {generatingReport ? 'Generating...' : 'Export Report'}
                      </span>
                    </button>
                  </div>
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
            <UnifiedSidebar title="Order Management" />

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