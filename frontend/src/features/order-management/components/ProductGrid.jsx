import ProductCard from './ProductCard';

const ProductGrid = ({ products, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="right-panel shadow-2xl transform perspective-1000 flex-1">
      <h2 className="panel-title drop-shadow-lg">Product Catalog ({products.length} products)</h2>
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
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;