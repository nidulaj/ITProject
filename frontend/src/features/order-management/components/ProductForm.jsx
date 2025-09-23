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
    <div className="left-panel shadow-2xl transform perspective-1000 flex-shrink-0">
      <div className="p-6 pb-4">
        <h2 className="panel-title drop-shadow-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
            className="form-input shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="3"
            required
            className="form-input form-textarea shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">Price (LKR):</label>
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
            className="form-input shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock_quantity" className="form-label">Stock Quantity:</label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleInputChange}
            placeholder="Enter stock quantity"
            min="0"
            required
            className="form-input shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter category"
            required
            className="form-input shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">Product Image:</label>
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
            <label className="form-label">Image Preview:</label>
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
          <button type="submit" disabled={loading} className="btn-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
          </button>
          {editingProduct && (
            <button type="button" onClick={onCancelEdit} className="btn-secondary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Cancel
            </button>
          )}
        </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;