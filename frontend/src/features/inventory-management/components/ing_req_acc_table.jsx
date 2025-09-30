import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function IngReqAccTable() {
  const [requests, setRequests] = useState([]);  // State to store ingredient requests
  const [loading, setLoading] = useState(false);  // Loading state for table data
  const [err, setErr] = useState("");  // Error state

  // Fetch the ingredient requests from the API
  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/req_ingredients`);
      setRequests(data?.data || []);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Failed to load ingredient requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    console.log("ingredeint error",id,status)
  try {
    // Use PATCH for updating the status
    const response = await axios.patch(`${API}/api/req_ingredients/${id}/status`, { status });
    
    // If accepting the request, reduce ingredient totals
    if (status === "accept") {
      const request = requests.find(r => r.req_id === id);
      if (request) {
        // Map ingredient names to icode_id based on your icode table
        const ingredientMappings = {
          'total_milk': 2,           // ICD002 = Total Milk
          'total_sugar': 3,         // ICD003 = Total Sugar  
          'total_strawberry': 4,    // ICD004 = Total strawberry
          'total_culture': 5,       // ICD005 = Total culture
          'total_blueberry': 6,     // ICD006 = Total blueberry
          'total_mango': 7,         // ICD007 = Total mango
          'total_topping1': 8,      // ICD008 = Total chocolate sirup
          'total_topping2': 9,      // ICD009 = Total strawberry sirup
          'total_topping3': 10,     // ICD010 = Total honey
          'total_bottom1': 11,      // ICD011 = Total cashew
          'total_bottom2': 12,      // ICD012 = Total peanut
          'total_bottom3': 13       // ICD013 = Total almond
        };
        
        console.log('Request data:', request);
        console.log('Processing ingredient reductions for request:', id);
        
        // Reduce totals for each ingredient that has a positive quantity
        for (const [ingredientKey, icode_id] of Object.entries(ingredientMappings)) {
          const quantity = request[ingredientKey] || 0;
          console.log(`Checking ${ingredientKey}: quantity=${quantity}, icode_id=${icode_id}`);
          
          if (quantity > 0) {
            try {
              console.log(`Attempting to reduce ${quantity} from icode_id ${icode_id} (${ingredientKey})`);
              const response = await axios.put(`${API}/api/ingredient-totals/reduce`, {
                icode_id: icode_id,
                quantity: quantity
              });
              console.log(`✅ Successfully reduced ${quantity} from icode_id ${icode_id} (${ingredientKey})`, response.data);
            } catch (reduceError) {
              console.error(`❌ Failed to reduce ${ingredientKey}:`, reduceError.response?.data || reduceError.message);
            }
          } else {
            console.log(`Skipping ${ingredientKey} - quantity is 0 or undefined`);
          }
        }
      }
    }
    
    // Update the local state to reflect the status change immediately
    setRequests(requests.map((r) => (r.req_id === id ? { ...r, status } : r)));
  } catch (e) {
    setErr(e?.response?.data?.error || e.message || "Failed to update status");
  }
};


  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Error message */}
      {err && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-sm">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            {err}
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Table for Ingredient Requests */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-blue-100 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">Ingredient Requests</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Request ID</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Recipe No</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Quantity</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Strawberry</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Mango</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Blueberry</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Milk</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Culture</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Sugar</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Topping 1</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Topping 2</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Topping 3</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Bottom 1</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Bottom 2</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Total Bottom 3</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Status</th>
                  <th className="p-4 text-center font-semibold text-sm uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Loading state */}
                {loading ? (
                  <tr>
                    <td colSpan={14} className="p-12 text-center">
                      <div className="inline-flex items-center gap-3 text-blue-700">
                        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="font-semibold">Loading…</span>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="p-12 text-center">
                      <p className="text-gray-500">No ingredient requests available</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.req_id} className="hover:bg-blue-50 transition-all duration-200 group">
                      <td className="p-4"><span className="text-blue-600 font-bold text-sm">{r.req_id}</span></td>
                      <td className="p-4"><span className="font-semibold text-gray-800">{r.recipe_no}</span></td>
                      <td className="p-4">{r.quantity}</td>
                      <td className="p-4">{r.total_strawberry}</td>
                      <td className="p-4">{r.total_mango}</td>
                      <td className="p-4">{r.total_blueberry}</td>
                      <td className="p-4">{r.total_milk}</td>
                      <td className="p-4">{r.total_culture}</td>
                      <td className="p-4">{r.total_sugar}</td>
                      <td className="p-4">{r.total_topping1}</td>
                      <td className="p-4">{r.total_topping2}</td>
                      <td className="p-4">{r.total_topping3}</td>
                      <td className="p-4">{r.total_bottom1}</td>
                      <td className="p-4">{r.total_bottom2}</td>
                      <td className="p-4">{r.total_bottom3}</td>
                      <td className="p-4 capitalize">
                        <span
                          className={`px-3 py-2 text-xs font-bold rounded-full shadow-sm border-2 inline-flex items-center gap-1
                            ${(r.status || "pending") === "pending"
                              ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                              : r.status === "accept"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                              : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"}`}
                        >
                          {(r.status || "pending") === "pending" && "⏳"}
                          {r.status === "accept" && "✅"}
                          {r.status === "reject" && "❌"}
                          <span className="uppercase ml-1">{r.status || "pending"}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateStatus(r.req_id, "accept")}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 rounded-lg transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                            title="Accept Request"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => updateStatus(r.req_id, "reject")}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                            title="Reject Request"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}