import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../contexts/NotificationContext';
import { useCustomer } from '../../../contexts/CustomerContext';
import { authFetchCustomer } from '../../user-management/utils/authFetchCustomer';
import { useDiscountCode } from '../../../hooks/useDiscountCode';

const CartSidebar = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart, total }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const { showSuccess, showError, showInfo } = useNotification();
  const { currentCustomer } = useCustomer();
  const navigate = useNavigate();
  
  // Discount code functionality
  const {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    isValidating,
    error,
    validateDiscountCode,
    removeDiscount
  } = useDiscountCode(total);

  // Fetch user info to get first name
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetchCustomer({
          method: "get",
          url: `http://localhost:5000/api/auth/userInfo`,
        });
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);
  const getImageSrc = (product) => {
    if (product.image) {
      if (typeof product.image === 'string') {
        return product.image.startsWith('data:') 
          ? product.image 
          : `data:image/jpeg;base64,${product.image}`;
      }
      if (product.image.data) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(product.image.data)));
        return `data:image/jpeg;base64,${base64}`;
      }
    }
    return null;
  };

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) {
      showError('Cart is empty');
      return;
    }

    // Validate delivery address
    if (!deliveryAddress.trim()) {
      showError('Please enter a delivery address');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Prepare order data with discount information and delivery address
      const orderData = {
        customer_id: currentCustomer?.id || 1, // Use current customer ID
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        discount_id: appliedDiscount ? appliedDiscount.discount.id : null,
        discount_amount: appliedDiscount ? appliedDiscount.discountAmount : 0,
        delivery_address: deliveryAddress.trim()
      };

      console.log('Creating order:', orderData);
      
      // Create order via API
      const response = await authFetchCustomer({
        method: 'post',
        url: 'http://localhost:5000/api/orders',
        data: orderData
      });
      
      if (response.data.success && response.data.message === 'Order placed successfully') {
        // Extract order ID first
        const orderId = response.data.order?.order_id || 
                       response.data.order?.id || 
                       response.data.order?.orderId ||
                       response.data.order?.orderID;
        
        console.log('Extracted order ID:', orderId);
        
        // Clear cart after successful order
        onClearCart();
        
        // Close cart sidebar
        onClose();
        
        // Show success message
        showSuccess('Order placed successfully! Redirecting to payment...');
        
        console.log('Order response:', response.data);
        console.log('Order object:', response.data.order);
        console.log('Order object keys:', Object.keys(response.data.order || {}));
        
        // Navigate to payment form with order data and toast message
        navigate('/dashboard/finance/payment-form', { 
          state: { 
            orderData: response.data.order,
            totalAmount: appliedDiscount ? appliedDiscount.finalPrice : total,
            orderId: orderId,
            customerName: userInfo?.first_name || currentCustomer?.name || 'Customer',
            showToast: true,
            toastMessage: `Your #${orderId} is creating, please pay to proceed`
          } 
        });
      } else {
        showError('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-l border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5m0 0h18m-8 8l1 1m-2 0l1-1m-4 4a2 2 0 104 0 2 2 0 00-4 0zm-8 0a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-500">{cart.length} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5m0 0h18m-8 8l1 1m-2 0l1-1m-4 4a2 2 0 104 0 2 2 0 00-4 0zm-8 0a2 2 0 104 0 2 2 0 00-4 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm">Add some products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                {/* Product Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  {getImageSrc(item) ? (
                    <img 
                      src={getImageSrc(item)} 
                      alt={item.name || item.product_name}
                      className="w-full h-full object-cover rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-gray-400 text-lg">📷</span>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                    {item.name || item.product_name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    LKR {item.price} each
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900 bg-gray-50 rounded-lg py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Price and Remove */}
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onRemoveItem(item.product_id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors duration-200 hover:bg-red-50 px-2 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200/50 p-6 space-y-4 bg-white/50 backdrop-blur-sm">
            {/* Delivery Address Section */}
            <div className="space-y-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
              <label className="block text-sm font-semibold text-gray-700">
                Delivery Address *
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="3"
                placeholder="Enter your delivery address"
                required
              />
              <p className="text-xs text-gray-500">
                Please provide your complete delivery address for order processing.
              </p>
            </div>

            {/* Discount Code Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Discount Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g., LKLKU12)"
                  className="flex-1 px-4 py-3 border border-gray-300/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
                />
                {appliedDiscount ? (
                  <button
                    onClick={removeDiscount}
                    className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => validateDiscountCode(discountCode)}
                    disabled={!discountCode || isValidating}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isValidating ? 'Validating...' : 'Apply'}
                  </button>
                )}
              </div>
              
              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              
              {/* Applied Discount Display */}
              {appliedDiscount && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-sm font-semibold">
                        🎉 {appliedDiscount.discount.name}
                      </span>
                    </div>
                    <span className="text-green-600 text-sm font-bold">
                      -LKR {appliedDiscount.discountAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtotal */}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-600">Subtotal:</span>
              <span className="text-sm font-semibold text-gray-800">
                LKR {total.toFixed(2)}
              </span>
            </div>
            
            {/* Discount */}
            {appliedDiscount && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-green-600">Discount:</span>
                <span className="text-sm font-bold text-green-600">
                  -LKR {appliedDiscount.discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            {/* Total */}
            <div className="flex justify-between items-center border-t border-gray-200/50 pt-4 pb-2">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LKR {(appliedDiscount ? appliedDiscount.finalPrice : total).toFixed(2)}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleProceedToCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Proceed to Checkout</span>
                  </div>
                )}
              </button>
              <button
                onClick={onClearCart}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;