const ProductCard = ({ product, onEdit, onDelete, loading }) => {
  // Debug logging to check product data
  console.log('ProductCard received product:', product);
  console.log('Product name:', product.name);
  console.log('Product description:', product.description);
  console.log('All product keys:', Object.keys(product));
  console.log('Product name field exists:', 'name' in product);
  console.log('Product description field exists:', 'description' in product);
  console.log('Product product_name field:', product.product_name);
  console.log('Product product_description field:', product.product_description);
  
  const getImageSrc = () => {
    if (product.image) {
      // If image is base64 string
      if (typeof product.image === 'string') {
        return product.image.startsWith('data:') 
          ? product.image 
          : `data:image/jpeg;base64,${product.image}`;
      }
      // If image is buffer/bytea, convert to base64
      if (product.image.data) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(product.image.data)));
        return `data:image/jpeg;base64,${base64}`;
      }
    }
    return null;
  };

  return (
    <div className="product-card card-3d">
      {getImageSrc() ? (
        <div className="product-image">
          <img 
            src={getImageSrc()} 
            alt={product.name || product.product_name || 'Product'}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="image-placeholder" style={{ display: 'none' }}>
            <span>📷</span>
            <small>Image not available</small>
          </div>
        </div>
      ) : (
        <div className="image-placeholder">
          <span>📷</span>
          <small>No image</small>
        </div>
      )}
      
      <div className="product-info">
        <h3 className="product-title">{product.name || product.product_name || 'No Name'}</h3>
        <p className="product-description">{product.description || product.product_description || 'No Description'}</p>
        <div className="product-details">
          <span className="price-tag product-detail-item">LKR {product.price}</span>
          <span className="stock-tag product-detail-item">Stock: {product.stock_quantity}</span>
          <span className="category-tag product-detail-item">{product.category}</span>
        </div>
      </div>
      
      <div className="card-buttons">
        <button 
          onClick={() => onEdit(product)}
          className="card-btn edit-btn shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          disabled={loading}
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(product.product_id)}
          className="card-btn delete-btn shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;