import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../contexts/NotificationContext';
import { useCustomer } from '../../../contexts/CustomerContext';

const CartSidebar = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart, total }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { currentCustomer } = useCustomer();
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

    try {
      setIsProcessing(true);
      
      // Prepare order data
      const orderData = {
        customer_id: currentCustomer?.id || 1, // Use current customer ID
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('Creating order:', orderData);
      
      // Create order via API
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      if (response.data.message === 'Order placed successfully') {
        // Clear cart after successful order
        onClearCart();
        
        // Close cart sidebar
        onClose();
        
        // Show success message
        showSuccess('Order placed successfully!');
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 perspective-1000 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 drop-shadow-sm">
            Shopping Cart ({cart.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5m0 0h18m-8 8l1 1m-2 0l1-1m-4 4a2 2 0 104 0 2 2 0 00-4 0zm-8 0a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                {/* Product Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  {getImageSrc(item) ? (
                    <img 
                      src={getImageSrc(item)} 
                      alt={item.name || item.product_name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">📷</span>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.name || item.product_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    LKR {item.price} each
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold hover:bg-gray-300 transition-colors duration-200"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Price and Remove */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onRemoveItem(item.product_id)}
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1 transition-colors duration-200"
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
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                LKR {total.toFixed(2)}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <button
                onClick={onClearCart}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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