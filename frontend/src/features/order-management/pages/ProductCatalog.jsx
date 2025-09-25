import { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductGrid';
import { useNotification } from '../../../contexts/NotificationContext';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import './ProductCatalog.css';

const ProductCatalog = ({ onNavigateToCustomer }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await authFetch({
        method: 'get',
        url: API_BASE_URL
      });
      console.log('API Response:', res.data);
      console.log('Products received:', res.data.products);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('stock_quantity', parseInt(formData.stock_quantity));
      productData.append('category', formData.category);
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      console.log('Sending product data:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock_quantity: formData.stock_quantity,
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
      console.error('Error adding product:', error);
      
      let errorMessage = 'Failed to add product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('stock_quantity', parseInt(formData.stock_quantity));
      productData.append('category', formData.category);
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      console.log('Updating product with ID:', editingProduct.product_id);
      console.log('Sending update data:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock_quantity: formData.stock_quantity,
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view } }));
  };

  return (
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
              
              <NavLink 
                title="Customer Shop" 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>}
                onClick={() => handleNavigation('customer')}
              />
            </div>
          </div>


        </div>
      </div>

      {/* Main content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen p-6">
        <div className="catalog-content flex gap-6">
          <ProductForm
            editingProduct={editingProduct}
            loading={loading}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onCancelEdit={handleCancelEdit}
          />
          
          <ProductGrid
            products={products}
            loading={loading}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;