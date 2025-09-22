import React from "react";
import { Edit, Trash2, Package, Calendar, User, Mail } from "lucide-react";

export default function CustomOrderTable({ title, rows, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-blue-100 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  ID
                </div>
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                <User className="w-4 h-4 inline mr-1" />
                Name
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                Fruit
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                Topping
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                Base
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                Qty
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                Address
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                Status
              </th>
              <th className="p-4 text-center font-semibold text-sm uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500">Your custom yogurt orders will appear here once placed</p>
                    <div className="mt-4 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">💡 Create your first custom yogurt above!</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, index) => (
                <tr key={r.id || index} className="hover:bg-blue-50 transition-all duration-200 group">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div>
                        <span className="text-blue-600 font-bold text-sm">{r.id || index + 1}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center">
                      <div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{r.customer_name}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      {r.email}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2"></span>
                      <span>
                        {r.fruit}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2"></span>
                      <span >
                        {r.topping}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2"></span>
                      <span>
                        {r.bottom}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <div >
                        <span className="font-bold text-green-700">{r.quantity}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div >
                      📅 {r.order_date ? new Date(r.order_date).toLocaleDateString() : "—"}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    
                      <div  title={r.address}>
                        {r.address}
                      
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span
                      className={`px-3 py-2 text-xs font-bold rounded-full shadow-sm border-2 ${
                        r.status === "pending"
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                          : r.status === "accepted"
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                          : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
                      }`}
                    >
                      {r.status === "pending"}
                      {r.status === "accepted"}
                      {r.status === "rejected"}
                      {" "}
                      {(r.status || 'pending').toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit?.(r)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                        title="Edit Order"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete?.(r)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {rows.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            📊 <strong>{rows.length}</strong> total {rows.length === 1 ? 'order' : 'orders'}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full border-2 border-yellow-300"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-100 to-green-200 rounded-full border-2 border-green-300"></div>
              <span className="text-gray-600">Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-100 to-red-200 rounded-full border-2 border-red-300"></div>
              <span className="text-gray-600">Rejected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}