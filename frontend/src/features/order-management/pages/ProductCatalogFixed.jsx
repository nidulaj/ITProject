import { useState, useEffect } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductGrid';
import './ProductCatalog.css';

const ProductCatalogFixed = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showSuccess, showError } = useNotification();

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await authFetch({
        method: 'get',
        url: API_BASE_URL
      });
      console.log('API Response:', res.data);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('stock_quantity', parseInt(formData.stock_quantity));
      productData.append('category', formData.category);
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      const res = await authFetch({
        method: 'post',
        url: API_BASE_URL,
        data: productData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await fetchProducts();
      showSuccess('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      showError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('stock_quantity', parseInt(formData.stock_quantity));
      productData.append('category', formData.category);
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      const res = await authFetch({
        method: 'put',
        url: `${API_BASE_URL}/${editingProduct.product_id}`,
        data: productData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await fetchProducts();
      setEditingProduct(null);
      showSuccess('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Failed to update product');
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
      const res = await authFetch({
        method: 'delete',
        url: `${API_BASE_URL}/${productId}`
      });
      
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      showSuccess('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleNavigation = (view) => {
    if (view === 'orders') {
      window.location.href = '/dashboard/order';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left sidebar navigation */}
      <div className="w-64 bg-white shadow-2xl fixed h-full">
        <div className="flex flex-col h-full">
          <div className="p-6 mb-4 bg-gradient-to-br from-blue-500 to-blue-600">
            <h1 className="text-xl font-bold text-white">Product Management</h1>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <button 
              onClick={() => handleNavigation('orders')}
              className="w-full text-left mb-2 px-4 py-3 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800"
            >
              <div className="text-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-medium">Orders Dashboard</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-64 w-full min-h-screen p-6">
        <div className="catalog-content flex gap-6">
          <ProductForm
            editingProduct={editingProduct}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onCancelEdit={handleCancelEdit}
          />
          
          <ProductGrid
            products={products}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogFixed;
