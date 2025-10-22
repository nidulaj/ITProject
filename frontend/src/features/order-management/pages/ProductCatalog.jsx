import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductGrid';
import FinalProductsTable from '../components/FinalProductsTable';
import UnifiedSidebar from '../components/UnifiedSidebar';
import Header from '../components/Header';
import { useNotification } from '../../../contexts/NotificationContext';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import './ProductCatalog.css';

const ProductCatalog = ({ onNavigateToCustomer }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
    fetchUserInfo();
  }, []);

  // Listen for custom event to open create product modal
  useEffect(() => {
    const handleOpenCreateModal = () => {
      setShowProductForm(true);
    };

    window.addEventListener('openCreateProductModal', handleOpenCreateModal);
    
    return () => {
      window.removeEventListener('openCreateProductModal', handleOpenCreateModal);
    };
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
          <UnifiedSidebar title="Product Management" />

          {/* Main content */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen">
            {/* Header */}
            <Header userInfo={userInfo} />
            
            <div className="p-6">

            {/* Final Products Table - Centered */}
            <div className="mb-6 flex justify-center">
              <div className="max-w-4xl w-full">
                <FinalProductsTable />
              </div>
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
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 text-3xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
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
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ProductCatalog;