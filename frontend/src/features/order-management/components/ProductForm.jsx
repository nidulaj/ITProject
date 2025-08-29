import { useState, useEffect } from 'react';

const ProductForm = ({ editingProduct, loading, onAddProduct, onUpdateProduct, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Update form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        stock_quantity: editingProduct.stock_quantity.toString(),
        category: editingProduct.category,
        image: null // Reset image when editing
      });
      // Set image preview if product has an image
      if (editingProduct.image) {
        setImagePreview(`data:image/jpeg;base64,${editingProduct.image}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: '',
        image: null
      });
      setImagePreview(null);
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.stock_quantity || !formData.category) {
      alert('Please fill in all required fields (name, description, price, stock quantity, and category)');
      return;
    }

    try {
      if (editingProduct) {
        await onUpdateProduct(formData);
      } else {
        await onAddProduct(formData);
      }
      
      // Reset form only if operation was successful
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: '',
        image: null
      });
      setImagePreview(null);
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="left-panel">
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (LKR):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock_quantity">Stock Quantity:</label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleInputChange}
            placeholder="Enter stock quantity"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter category"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <small className="file-help">Supported formats: JPG, PNG, GIF (Max: 5MB)</small>
        </div>

        {imagePreview && (
          <div className="image-preview-container">
            <label>Image Preview:</label>
            <div className="image-preview">
              <img src={imagePreview} alt="Product preview" />
              <button 
                type="button" 
                onClick={removeImage}
                className="remove-image-btn"
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
          </button>
          {editingProduct && (
            <button type="button" onClick={onCancelEdit} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;