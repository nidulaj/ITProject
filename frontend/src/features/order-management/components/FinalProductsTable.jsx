import React, { useState, useEffect } from 'react';
import { authFetch } from '../../user-management/utils/authFetchStaff';

const FinalProductsTable = () => {
  const [finalProducts, setFinalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinalProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authFetch({
        method: 'get',
        url: 'http://localhost:5000/api/final'
      });
      setFinalProducts(response.data.finalProduct || []);
    } catch (err) {
      console.error('Error fetching final products:', err);
      setError('Failed to fetch final products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinalProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div className="text-gray-600 text-sm">Loading final products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 mb-2 text-sm">{error}</div>
        <button 
          onClick={fetchFinalProducts}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 text-center">Final Products Inventory</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finalProducts.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-3 py-3 text-center text-gray-500 text-sm">
                  No final products available
                </td>
              </tr>
            ) : (
              finalProducts.map((product, index) => (
                <tr key={product.fproduct_id || index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.fproduct_id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {product.pname}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.quantity > 50 
                        ? 'bg-green-100 text-green-800' 
                        : product.quantity > 10 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.quantity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalProductsTable;
