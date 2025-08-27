const ProductCard = ({ product, onEdit, onDelete, loading }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="description">{product.description}</p>
      <div className="product-details">
        <span className="price">${product.price}</span>
        <span className="stock">Stock: {product.stock_quantity}</span>
        <span className="category">{product.category}</span>
      </div>
      <div className="card-buttons">
        <button 
          onClick={() => onEdit(product)}
          className="edit-btn"
          disabled={loading}
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(product.product_id)}
          className="delete-btn"
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;