import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductGrid';
import FinalProductsTable from '../components/FinalProductsTable';
import { useNotification } from '../../../contexts/NotificationContext';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import './ProductCatalog.css';

const ProductCatalog = ({ onNavigateToCustomer }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const res = await authFetch({
        method: 'get',
        url: API_BASE_URL,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('API Response:', res.data);
      console.log('Products received:', res.data.products);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Don't show error notification, just set empty products
      setProducts([]);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      console.log('🚀 handleAddProduct called with:', formData);
      
      // Create FormData for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('final_product_id', parseInt(formData.final_product_id));
      productData.append('category', formData.category);
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      console.log('📤 Sending product data to backend:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        final_product_id: formData.final_product_id,
        category: formData.category,
        hasImage: !!formData.image
      });
      
      const res = await authFetch({
        method: 'post',
        url: API_BASE_URL,
        data: productData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Product added successfully:', res.data);
      
      // Refresh products list to get the new product with ID
      await fetchProducts();
      showSuccess('Product added successfully!');
    } catch (error) {
      //console.error('Error adding product:', error);
      
      let errorMessage = 'Failed to add product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      showError(errorMessage);
      throw error;
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      
      // Create FormData for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('final_product_id', parseInt(formData.final_product_id));
      productData.append('category', formData.category);
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      console.log('Updating product with ID:', editingProduct.product_id);
      console.log('Sending update data:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        final_product_id: formData.final_product_id,
        category: formData.category,
        hasImage: !!formData.image
      });
      
      const res = await authFetch({
        method: 'put',
        url: `${API_BASE_URL}/${editingProduct.product_id}`,
        data: productData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Product updated successfully:', res.data);
      
      // Refresh products list to get updated data with image
      await fetchProducts();
      setEditingProduct(null);
      showSuccess('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      
      let errorMessage = 'Failed to update product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      showError(errorMessage);
      throw error;
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('Deleting product with ID:', productId);
      
      const res = await authFetch({
        method: 'delete',
        url: `${API_BASE_URL}/${productId}`
      });
      console.log('Product deleted successfully:', res.data);
      
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      showSuccess('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      
      let errorMessage = 'Failed to delete product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      showError(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Navigation component similar to OrderManagementDashboard
  const NavLink = ({ title, icon, isActive = false, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 hover:shadow-md'}`}
      >
        <div className="text-xl">{icon}</div>
        <span className="font-medium">{title}</span>
      </button>
    );
  };

  const handleNavigation = (view) => {
    if (view === 'orders') {
      navigate('/dashboard/order');
    } else if (view === 'customer') {
      navigate('/products');
    } else {
      // Stay on current page for other views
      console.log('Navigation to:', view);
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="product-catalog-container">
          {/* Left sidebar navigation */}
          <div className="w-64 bg-white shadow-2xl fixed h-full transform perspective-1000">
            <div className="flex flex-col h-full">
              <div className="p-6 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform rotate-x-1">
                <h1 className="text-xl font-bold text-white drop-shadow-lg">Product Management</h1>
              </div>

              <div className="px-4 mb-6">
                <div className="py-3 px-4 mb-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 drop-shadow-sm">Total Products</span>
                    <span className="bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 text-xs font-medium rounded-full px-2 py-0.5 shadow-md">
                      {products.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <NavLink 
                    title="Product Catalog"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>}
                    isActive={true}
                  />
                  

                  <NavLink 
                    title="Orders Dashboard" 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>}
                    onClick={() => handleNavigation('orders')}
                  />
                </div>
              </div>


            </div>
          </div>

          {/* Main content */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen p-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                + Create New Product
              </button>
            </div>

            {/* Final Products Table - Reduced Width */}
            <div className="mb-6 max-w-4xl">
              <FinalProductsTable />
            </div>
            
            {/* Product Grid - Full Width */}
            <div className="w-full">
              <ProductGrid
                products={products}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                    <ProductForm
                      editingProduct={editingProduct}
                      onAddProduct={handleAddProduct}
                      onUpdateProduct={handleUpdateProduct}
                      onCancelEdit={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ProductCatalog;