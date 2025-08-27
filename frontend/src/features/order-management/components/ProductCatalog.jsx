import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductGrid from './ProductGrid';
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
      await axios.post(API_BASE_URL, {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      });
      
      // Refresh products list to get the new product with ID
      await fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/${editingProduct.product_id}`, {
        product_id: editingProduct.product_id,
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      });
      
      setProducts(prev => 
        prev.map(product => 
          product.product_id === editingProduct.product_id 
            ? { ...product, ...formData, price: parseFloat(formData.price), stock_quantity: parseInt(formData.stock_quantity) }
            : product
        )
      );
      
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
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
      await axios.delete(`${API_BASE_URL}/${productId}`);
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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