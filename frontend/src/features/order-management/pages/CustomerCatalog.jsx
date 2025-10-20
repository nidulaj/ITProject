import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerProductCard from '../components/CustomerProductCard';
import { useNotification } from '../../../contexts/NotificationContext';
import { useCustomer } from '../../../contexts/CustomerContext';
import { useCart } from '../../../contexts/CartContext';
import { authFetchCustomer } from '../../user-management/utils/authFetchCustomer';

const CustomerCatalog = () => {
  console.log('CustomerCatalog component rendering...');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { showSuccess, showError } = useNotification();
  const { currentCustomer, setCustomer } = useCustomer();
  const { addToCart } = useCart();
  
  console.log('CustomerCatalog state:', { products, currentCustomer });

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', API_BASE_URL);
      const response = await authFetchCustomer({
        method: 'get',
        url: API_BASE_URL
      });
      console.log('Products response:', response.data);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to fetch products');
      // Set empty products array to prevent blank page
      setProducts([]);
    }
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

  // Add error boundary fallback
  if (!currentCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Customer Data...</h2>
          <p className="text-gray-600">Please wait while we load your information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Products Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md hover:shadow-lg transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="md:w-48 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg">No products found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.product_id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden relative">
                    {product.image ? (
                      <img
                        src={product.image.startsWith('data:') 
                          ? product.image 
                          : `data:image/jpeg;base64,${product.image}`}
                        alt={product.name || product.product_name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📷</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {product.name || product.product_name || 'No Name'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {product.description || product.product_description || 'No Description'}
                    </p>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm">(4.5)</span>
                    </div>

                    {/* Stock Information */}
                    <div className="mb-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.stock_quantity === 0 
                          ? 'bg-red-100 text-red-800' 
                          : product.stock_quantity <= 10 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock_quantity === 0 
                          ? 'Out of Stock' 
                          : product.stock_quantity <= 10 
                          ? `Low Stock (${product.stock_quantity})` 
                          : `In Stock (${product.stock_quantity})`
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        LKR {product.price}
                      </span>
                      <button 
                        onClick={() => {
                          addToCart(product, 1);
                          showSuccess(`${product.name || product.product_name} added to cart!`);
                        }}
                        disabled={product.stock_quantity === 0}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
                          product.stock_quantity === 0
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Why Choose Section */}
          <div className="text-center mt-16 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Products?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our products are crafted with the highest quality, using 100% pure Ceylon milk to bring you a healthy and delicious treat that your family will love.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerCatalog;