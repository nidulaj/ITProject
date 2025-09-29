import React, { useEffect, useState } from "react";
import axios from "axios";
import DiscountForm from "../components/DiscountForm";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const DiscountPage = ({ onUpdateStats, onUpdateRecentActivity }) => {
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);

  const fetchDiscounts = async () => {
    try {
      const res = await authFetch({
        method: 'get',
        url: "http://localhost:5000/api/discounts"
      });
      setDiscounts(res.data || []);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;
    try {
      const res = await authFetch({
        method: 'delete',
        url: `http://localhost:5000/api/discounts/${id}`
      });
      setDiscounts((prev) => prev.filter((d) => d.discount_id !== id));
      if (onUpdateStats) onUpdateStats();
      if (onUpdateRecentActivity) onUpdateRecentActivity();
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  const handleEdit = (discount) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0];
    };

    const formattedDiscount = {
      ...discount,
      valid_from: formatDate(discount.valid_from),
      valid_to: formatDate(discount.valid_to),
    };

    setEditingDiscount(formattedDiscount);
    setShowForm(true);
  };

  const handleFormSuccess = (savedDiscount) => {
    if (!savedDiscount) {
      fetchDiscounts();
      setShowForm(false);
      setEditingDiscount(null);
      return;
    }

    const exists = discounts.some(d => d.discount_id === savedDiscount.discount_id);

    if (exists) {
      setDiscounts(prev => prev.map(d => d.discount_id === savedDiscount.discount_id ? savedDiscount : d));
    } else {
      setDiscounts(prev => [...prev, savedDiscount]);
    }

    setShowForm(false);
    setEditingDiscount(null);
    if (onUpdateStats) onUpdateStats();
    if (onUpdateRecentActivity) onUpdateRecentActivity();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Available Discounts</h2>

        {!showForm && (
          <button
            onClick={() => {
              setEditingDiscount(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
          >
            Create New Discount
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingDiscount(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              &times;
            </button>

            <DiscountForm
              discount={editingDiscount}
              onSuccess={(saved) => handleFormSuccess(saved)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {discounts.map((d) => (
          <div
            key={d.discount_id}
            className="bg-white shadow-md rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg hover:scale-[1.01] transition"
          >
            <div>
              <h3 className="font-bold text-xl text-blue-600 mb-2">
                {d.discount_name}
              </h3>
              <p className="text-gray-700">
                <span className="font-medium">Type:</span> {d.discount_type}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Value:</span> {d.value}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Criteria:</span> {d.eligibility_criteria}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Code:</span> <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">{d.discount_code || 'N/A'}</span>
              </p>
              <p className="text-gray-700 mt-2 text-sm">
                <span className="font-medium">Valid:</span>{" "}
                {String(d.valid_from ?? "").slice(0, 10)} → {String(d.valid_to ?? "").slice(0, 10)}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleDelete(d.discount_id)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Remove
              </button>
              <button
                onClick={() => handleEdit(d)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountPage;

