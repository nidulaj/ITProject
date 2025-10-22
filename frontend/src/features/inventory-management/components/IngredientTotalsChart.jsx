import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function IngredientTotalsChart() {
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch ingredient totals
  const loadTotals = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`${API}/api/ingredient-totals`);
      setTotals(data?.totals || []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load totals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTotals();
  }, []);

  // Format data for chart
  const chartData = totals.map((item) => ({
    name: item.ingredient_code,
    quantity: Number(item.total_quantity),
  }));

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-6">
        Loading ingredient totals chart...
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded mt-6">
        {error}
      </div>
    );

  if (totals.length === 0)
    return (
      <div className="text-center text-gray-500 mt-6">
        No totals data available yet.
      </div>
    );

  return (
    <div className="bg-white p-6 shadow-lg rounded-2xl">
      <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
        Ingredient Totals (Bar Chart)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#3B82F6" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
