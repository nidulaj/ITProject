import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function IngredientTotalsPage() {
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch ingredient totals
  const loadTotals = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`${API}/api/ingredient-totals`);
      setTotals(data?.totals || []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load ingredient totals");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from ingredients
  const calculateTotals = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.post(`${API}/api/ingredient-totals/calculate`);
      setSuccess("Totals calculated successfully!");
      await loadTotals();
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to calculate totals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTotals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">Ingredient Totals</h2>
              <p className="text-gray-600">Total quantities by ingredient code</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={calculateTotals}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Calculate Totals
              </button>
              <button
                onClick={loadTotals}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left">Total ID</th>
                  <th className="p-3 text-left">Ingredient Code</th>
                  <th className="p-3 text-left">Ingredient Name</th>
                  <th className="p-3 text-left">Total Quantity</th>
                  <th className="p-3 text-left">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : totals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No totals available. Click "Calculate Totals" to create them.
                    </td>
                  </tr>
                ) : (
                  totals.map((total) => (
                    <tr key={total.total_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{total.total_id}</td>
                      <td className="p-3 font-semibold">{total.ingredient_code}</td>
                      <td className="p-3">{total.icode_name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {total.total_quantity}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(total.last_updated).toLocaleString()}
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