import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="right-panel">
      <h2 className="panel-title">Product Catalog ({products.length} products)</h2>
      {loading && <div className="loading">Loading...</div>}
      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">No products found. Add your first product!</div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;