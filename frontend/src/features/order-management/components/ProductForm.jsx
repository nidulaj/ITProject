import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../user-management/utils/authFetchStaff';

const ProductForm = ({ editingProduct, onAddProduct, onUpdateProduct, onCancelEdit }) => {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Product name must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Product description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Product description must be less than 500 characters';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        newErrors.price = 'Price must be a valid number';
      } else if (price <= 0) {
        newErrors.price = 'Price must be greater than 0';
      } else if (price > 999999) {
        newErrors.price = 'Price must be less than 1,000,000';
      }
    }

    // Category validation
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.trim().length < 2) {
      newErrors.category = 'Category must be at least 2 characters';
    } else if (formData.category.trim().length > 50) {
      newErrors.category = 'Category must be less than 50 characters';
    }

    // Final product validation
    if (!formData.final_product_id) {
      newErrors.final_product_id = 'Please select a final product';
    }

    // Image validation (optional but if provided, validate)
    if (formData.image) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.image.size > maxSize) {
        newErrors.image = 'Image size must be less than 5MB';
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = 'Image must be JPG, PNG, or GIF format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific error when user starts typing
  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
    
    // Clear error for this field when user starts typing
    clearError(name);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear any existing image error
      clearError('image');
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPG, PNG, or GIF)'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
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
    
    // Prevent double submission
    if (isSubmitting) return;
    
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', formData);
    
    // Validate form
    if (!validateForm()) {
      console.log('❌ Validation failed');
      return;
    }
    
    console.log('✅ All fields validated');
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        await onUpdateProduct(formData);
        // For editing, just close the modal
        onCancelEdit();
      } else {
        await onAddProduct(formData);
        // For adding new product, close the modal
        onCancelEdit();
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
      setErrors({});
      
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Product Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price (LKR):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              step="0.01"
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.price 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        {/* Row 2: Description */}
        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="3"
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
              errors.description 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Row 3: Final Product and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="final_product_id" className="block text-sm font-medium text-gray-700 mb-2">Final Product:</label>
            <select
              id="final_product_id"
              name="final_product_id"
              value={formData.final_product_id}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.final_product_id 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={loadingFinalProducts}
            >
              <option value="">Select a final product</option>
              {finalProducts.map((product) => (
                <option key={product.fproduct_id} value={product.fproduct_id}>
                  ID: {product.fproduct_id} - {product.pname} (Qty: {product.quantity})
                </option>
              ))}
            </select>
            {errors.final_product_id && (
              <p className="text-red-500 text-xs mt-1">{errors.final_product_id}</p>
            )}
            {loadingFinalProducts && (
              <small className="text-blue-500 text-xs mt-1">Loading final products...</small>
            )}
            <small className="text-gray-500 text-xs mt-1">
              Select the final product from inventory to link stock.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category"
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.category 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Row 4: Image Upload */}
        <div className="form-group">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Product Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.image 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}
          <small className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max: 5MB)</small>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview:</label>
            <div className="relative inline-block">
              <img src={imagePreview} alt="Product preview" className="w-32 h-32 object-cover rounded-lg border border-gray-300" />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 shadow-md ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg'
            } text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingProduct ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              editingProduct ? 'Update Product' : 'Add Product'
            )}
          </button>
          {editingProduct && (
            <button 
              type="button" 
              onClick={onCancelEdit} 
              disabled={isSubmitting}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;