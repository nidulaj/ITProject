import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductGrid';
import './ProductCatalog.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

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
      alert('Failed to fetch products');
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
      
      const response = await axios.post(API_BASE_URL, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Product added successfully:', response.data);
      
      // Refresh products list to get the new product with ID
      await fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      
      let errorMessage = 'Failed to add product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      alert(errorMessage);
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
      
      const response = await axios.put(`${API_BASE_URL}/${editingProduct.product_id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Product updated successfully:', response.data);
      
      // Refresh products list to get updated data with image
      await fetchProducts();
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      
      let errorMessage = 'Failed to update product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      alert(errorMessage);
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
      
      const response = await axios.delete(`${API_BASE_URL}/${productId}`);
      console.log('Product deleted successfully:', response.data);
      
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      
      let errorMessage = 'Failed to delete product';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += ': ' + error.response.data.details;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="product-catalog-container">
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
  );
};

export default ProductCatalog;