import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerProductCard from '../components/CustomerProductCard';
import CartSidebar from '../components/CartSidebar';
import NotificationIcon from '../../../components/NotificationIcon';
import { useNotification } from '../../../contexts/NotificationContext';
import { useCustomer } from '../../../contexts/CustomerContext';

const CustomerCatalog = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { showSuccess, showError } = useNotification();
  const { currentCustomer, setCustomer } = useCustomer();

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    
    showSuccess(`${product.name || product.product_name} added to cart!`);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    showSuccess('Item removed from cart');
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
    showSuccess('Cart cleared');
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || product.product_name || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (product.description || product.product_description || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (product.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 drop-shadow-lg">
              Product Catalog
            </h1>
            
            {/* Customer Selection and Controls */}
            <div className="flex items-center gap-4">
              {/* Customer Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Customer:</label>
                <select 
                  value={currentCustomer?.id || 1} 
                  onChange={(e) => {
                    const customerId = parseInt(e.target.value);
                    const customerName = e.target.selectedOptions[0].text;
                    setCustomer({ id: customerId, name: customerName });
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Customer 1 (Default Customer)</option>
                  <option value={1001}>Customer 1001 (Test Customer)</option>
                </select>
              </div>
              
              {/* Notification and Cart Icons */}
              <div className="flex items-center gap-3">
              {/* Notification Icon */}
              <NotificationIcon customerId={currentCustomer?.id || 1} />
              

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5m0 0h18m-8 8l1 1m-2 0l1-1m-4 4a2 2 0 104 0 2 2 0 00-4 0zm-8 0a2 2 0 104 0 2 2 0 00-4 0z" />
                </svg>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:w-48 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-gray-600">Loading products...</div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600">No products found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <CustomerProductCard
                  key={product.product_id}
                  product={product}
                  onAddToCart={addToCart}
                  cartItem={cart.find(item => item.product_id === product.product_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
        total={getCartTotal()}
      />
    </div>
  );

  async function handleCheckout() {
    try {
      setLoading(true);
      
      // Create order
      const orderData = {
        customer_id: 1, // In a real app, this would come from user context
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      if (response.data.success) {
        // Clear cart
        clearCart();
        setIsCartOpen(false);
        showSuccess('Order placed successfully!');
      } else {
        showError('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showError('Failed to place order');
    } finally {
      setLoading(false);
    }
  }
};

export default CustomerCatalog;