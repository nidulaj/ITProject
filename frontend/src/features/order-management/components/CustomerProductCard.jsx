import { useState } from 'react';

const CustomerProductCard = ({ product, onAddToCart, cartItem }) => {
  const [quantity, setQuantity] = useState(1);

  const getImageSrc = () => {
    if (product.image) {
      if (typeof product.image === 'string') {
        return product.image.startsWith('data:') 
          ? product.image 
          : `data:image/jpeg;base64,${product.image}`;
      }
      if (product.image.data) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(product.image.data)));
        return `data:image/jpeg;base64,${base64}`;
      }
    }
    return null;
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-40 overflow-hidden">
        {getImageSrc() ? (
          <img 
            src={getImageSrc()} 
            alt={product.name || product.product_name || 'Product'}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`${getImageSrc() ? 'hidden' : 'flex'} w-full h-full bg-gray-100 flex-col items-center justify-center text-gray-500`}
        >
          <span className="text-3xl mb-1">📷</span>
          <small className="text-xs">No image</small>
        </div>
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        
        {/* Cart Indicator */}
        {cartItem && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            In Cart: {cartItem.quantity}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name || product.product_name || 'No Name'}
        </h3>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {product.description || product.product_description || 'No Description'}
        </p>
        
        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            LKR {product.price}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {product.stock_quantity}
          </span>
        </div>
        
        {/* Category */}
        {product.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Quantity Controls */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-600">Quantity:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= product.stock_quantity}
              className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || quantity > product.stock_quantity}
          className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors duration-200"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default CustomerProductCard;