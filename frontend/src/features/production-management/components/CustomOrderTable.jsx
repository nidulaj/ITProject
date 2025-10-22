import React from "react";
import { Edit, Trash2, Package, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

export default function CustomOrderTable({ title, rows, onEdit, onDelete }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted": return <CheckCircle className="w-3 h-3" />;
      case "rejected": return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-700 border-green-300";
      case "rejected": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-blue-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-600">{title}</h2>
              <p className="text-sm text-gray-500">Manage your custom yogurt orders</p>
            </div>
          </div>
          {rows.length > 0 && (
            <div className="text-sm text-gray-500">
              {rows.length} orders
            </div>
          )}
        </div>
      </div>
      
      {rows.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 text-sm">Your custom yogurt orders will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th> */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Fruit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Topping</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Base</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((r, index) => (
                <tr key={r.id || index} className="hover:bg-blue-50 transition-colors duration-150">
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">#{r.id || index + 1}</span>
                  </td> */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{r.customer_name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{r.fruit}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{r.topping}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{r.bottom}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{r.quantity}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {r.order_date ? new Date(r.order_date).toLocaleDateString() : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600 max-w-xs truncate" title={r.address}>
                      {r.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(r.status || "pending")}`}>
                      {getStatusIcon(r.status || "pending")}
                      <span className="ml-1 uppercase">{r.status || "pending"}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit?.(r)}
                        className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-150"
                        title="Edit Order"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete?.(r)}
                        className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-150"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {rows.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm">
          <div className="text-gray-600">
            <strong>{rows.length}</strong> total {rows.length === 1 ? 'order' : 'orders'}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-100 border border-blue-300 rounded-full"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-100 border border-green-300 rounded-full"></div>
              <span className="text-gray-600">Accepted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-100 border border-red-300 rounded-full"></div>
              <span className="text-gray-600">Rejected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}