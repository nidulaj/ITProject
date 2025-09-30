import { useState, useEffect } from 'react';
import { authFetch } from '../../user-management/utils/authFetchStaff';

const ProductForm = ({ editingProduct, onAddProduct, onUpdateProduct, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    final_product_id: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [finalProducts, setFinalProducts] = useState([]);
  const [loadingFinalProducts, setLoadingFinalProducts] = useState(false);

  // Fetch final products for dropdown
  const fetchFinalProducts = async () => {
    try {
      console.log('🔄 Fetching final products...');
      setLoadingFinalProducts(true);
      const response = await authFetch({
        method: 'get',
        url: 'http://localhost:5000/api/final'
      });
      console.log('📦 Final products response:', response.data);
      setFinalProducts(response.data.finalProduct || []);
      console.log('✅ Final products loaded:', response.data.finalProduct?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching final products:', error);
      setFinalProducts([]);
    } finally {
      setLoadingFinalProducts(false);
    }
  };

  // Load final products on component mount
  useEffect(() => {
    fetchFinalProducts();
  }, []);

  // Update form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        final_product_id: editingProduct.final_product_id || '',
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
        category: '',
        final_product_id: '',
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
    
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', formData);
    console.log('🔍 Final products available:', finalProducts.length);
    
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.final_product_id) {
      console.log('❌ Validation failed - missing fields');
      console.log('name:', formData.name, 'description:', formData.description, 'price:', formData.price, 'category:', formData.category, 'final_product_id:', formData.final_product_id);
      alert('Please fill in all required fields (name, description, price, category, and final product)');
      return;
    }
    
    console.log('✅ All fields validated');

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
        category: '',
        final_product_id: '',
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
          <label htmlFor="final_product_id" className="form-label">Final Product:</label>
          <select
            id="final_product_id"
            name="final_product_id"
            value={formData.final_product_id}
            onChange={handleInputChange}
            required
            className="form-input shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            disabled={loadingFinalProducts}
          >
            <option value="">Select a final product</option>
            {finalProducts.map((product) => (
              <option key={product.fproduct_id} value={product.fproduct_id}>
                ID: {product.fproduct_id} - {product.pname} (Qty: {product.quantity})
              </option>
            ))}
          </select>
          {loadingFinalProducts && (
            <small className="text-blue-500 text-xs mt-1">Loading final products...</small>
          )}
          <small className="text-gray-500 text-xs mt-1">
            Select the final product from inventory to link stock.
          </small>
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
          <button type="submit" className="btn-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            {editingProduct ? 'Update Product' : 'Add Product'}
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