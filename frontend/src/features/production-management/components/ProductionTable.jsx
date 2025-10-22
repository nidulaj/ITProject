// components/ProductionTable.jsx
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const ProductionTable = ({ title, data, columns, actions = true }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in production': return 'bg-blue-100 text-blue-800';
      case 'pending approval': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'accept': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'reject': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-orange-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-4 text-left text-x font-bold text-gray-800 ">
                  {column}
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-left text-x font-bold text-gray-800">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                    {typeof cell === 'string' && 
                     (cell.toLowerCase().includes('production') || 
                      cell.toLowerCase().includes('pending') || 
                      cell.toLowerCase().includes('approved') ||
                      cell.toLowerCase().includes('completed') ||
                      cell.toLowerCase().includes('accept') ||
                      cell.toLowerCase().includes('reject') ||
                      cell.toLowerCase().includes('delivered') ||
                      cell.toLowerCase().includes('processing')) ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cell)}`}>
                        {cell}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-900">{cell}</span>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionTable;