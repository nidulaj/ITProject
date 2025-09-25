import React, { useState, useEffect } from "react";
import axios from "axios";
import { authFetch } from "../../user-management/utils/authFetchStaff";


const SpecialIngredientManager = () => {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });
  const [specialIngredients, setSpecialIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // For popup edit
  const [editForm, setEditForm] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchSpecialIngredients = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/special");

           const res = await authFetch({
            method: "get",
            url: "http://localhost:5000/api/special",
          });


      if (res.data.specialIngredient) {
        setSpecialIngredients(res.data.specialIngredient);
      } else {
        setSpecialIngredients([]);
      }
    } catch (err) {
      console.error("Error fetching special ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialIngredients();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.post("http://localhost:5000/api/special", form);

      const res = await authFetch({
                    method: "post",
                    url: "http://localhost:5000/api/special",
                    data: form,
                  });

      alert("Special ingredient added!");
      setForm({ name: "", quantity: "", expiry_date: "", storage_zone_id: "" });
      fetchSpecialIngredients();
    } catch (err) {
      console.error(err);
      alert("Error saving special ingredient");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        //await axios.delete(`http://localhost:5000/api/special/${id}`);

         const res = await authFetch({
                method: "delete",
                url: `http://localhost:5000/api/special/${id}`,
                });
        
        alert("Special ingredient deleted!");
        fetchSpecialIngredients();
      } catch (err) {
        console.error(err);
        alert("Error deleting special ingredient");
      }
    }
  };

  const handleEdit = (special_ingredient) => {
    setEditForm({
      name: special_ingredient.name,
      quantity: special_ingredient.quantity,
      expiry_date: special_ingredient.expiry_date?.split("T")[0] || "",
      storage_zone_id: special_ingredient.storage_zone_id,
    });
    setEditId(special_ingredient.special_id);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // await axios.put(`http://localhost:5000/api/special/${editId}`, {
      //   special_id: editId,
      //   ...editForm,
      // });
      const res = await authFetch({
              method: "put",
              url: `http://localhost:5000/api/special/${editId}`,
              data: {
              special_id: editId,
              ...editForm,
              },
            });

      alert("Special ingredient updated!");
      setShowEditModal(false);
      setEditId(null);
      fetchSpecialIngredients();
    } catch (err) {
      console.error(err);
      alert("Error updating special ingredient");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Add Special Ingredient Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Special Ingredient
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Storage Zone ID
            </label>
            <input
              type="text"
              name="storage_zone_id"
              value={form.storage_zone_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
        >
          Save
        </button>
      </form>

      {/* Special Ingredient List */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Special Ingredient List
        </h2>

        {loading ? (
          <p className="text-gray-700">Loading special ingredients...</p>
        ) : specialIngredients.length === 0 ? (
          <p className="text-gray-700">No special ingredients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-gray-800">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left border-r border-blue-700">ID</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">Name</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">Quantity(kg,l,units)</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">Expiry Date</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">Storage Zone ID</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">Created At</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialIngredients.map((ingredient, idx) => (
                  <tr
                    key={ingredient.special_id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-blue-100 transition-colors`}
                  >
                    <td className="py-2 px-4 border-r border-gray-300 font-medium">{ingredient.special_id}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.name}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.quantity}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.expiry_date ? new Date(ingredient.expiry_date).toLocaleDateString() : ""}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.storage_zone_id}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.created_at ? new Date(ingredient.created_at).toLocaleDateString() : ""}</td>
                    <td className="py-2 px-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.special_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popup Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Update Special Ingredient</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                name="quantity"
                value={editForm.quantity}
                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="date"
                name="expiry_date"
                value={editForm.expiry_date}
                onChange={(e) => setEditForm({ ...editForm, expiry_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="storage_zone_id"
                value={editForm.storage_zone_id}
                onChange={(e) => setEditForm({ ...editForm, storage_zone_id: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialIngredientManager;
