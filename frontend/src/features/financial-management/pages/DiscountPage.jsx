import React, { useEffect, useState } from "react";
import axios from "axios";
import DiscountForm from "../components/DiscountForm";

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false); // starts as false
  const [editingDiscount, setEditingDiscount] = useState(null);

  // Fetch discounts
  const fetchDiscounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/discounts");
      setDiscounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Function to update discount via API
  const updateDiscount = async (id, updatedData) => {
  try {
    await axios.put(`http://localhost:5000/api/discounts/${id}`, updatedData);
    fetchDiscounts(); // refresh grid
    setShowForm(false); // close modal
  } catch (err) {
    console.error(err);
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/discounts/${id}`);
      setDiscounts(discounts.filter(d => d.discount_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header and button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Available Discounts</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create New Discount
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {discounts.map(d => (
    <div key={d.discount_id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{d.discount_name}</h3>
      <p className="text-gray-700 mb-1">Type: {d.discount_type}</p>
      <p className="text-gray-700 mb-1">Value: {d.discount_value}{d.discount_type === "percentage" ? "%" : ""}</p>
      <p className="text-gray-700 mb-2">Criteria: {d.eligibility_criteria}</p>
      <div className="flex justify-end">
        <button
          onClick={() => handleDelete(d.discount_id)}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition">
          Remove
        </button>

        <button
          onClick={() => {
            setEditingDiscount(d);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Edit
        </button>

      </div>
    </div>
  ))}
</div>


      {/* Discounts grid */}
      {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {discounts.map(d => (
          <div key={d.discount_id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{d.discount_name}</h3>
            <p className="text-gray-700 mb-1">Type: {d.discount_type}</p>
            <p className="text-gray-700 mb-1">Value: {d.discount_value}{d.discount_type === "percentage" ? "%" : ""}</p>
            <p className="text-gray-700 mb-2">Criteria: {d.eligibility_criteria}</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(d.discount_id)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>*/}

      {/* Modal for Discount Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              &times;
            </button>
            <DiscountForm
              discount={editingDiscount}
              onUpdate={updateDiscount}
              onSuccess={() => {
                fetchDiscounts(); // refresh discounts
                setShowForm(false); // close modal
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;
