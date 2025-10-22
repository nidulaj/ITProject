import ProductCard from './ProductCard';

const ProductGrid = ({ products, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Product Catalog</h2>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Add your first product to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;