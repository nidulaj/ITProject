import React, { useState, useEffect } from "react";
import axios from "axios";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const IngredientManager = () => {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Validation error state
  const [error, setError] = useState("");

  // For popup edit form
  const [editForm, setEditForm] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchIngredients = async () => {
      
    //   const res = await axios.get("http://localhost:5000/api/ingredient");
     try {
          const res = await authFetch({
            method: "get",
            url: "http://localhost:5000/api/ingredient",
          });
      if (Array.isArray(res.data)) setIngredients(res.data);
      else if (res.data.ingredients) setIngredients(res.data.ingredients);
      else setIngredients([]);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: expiry date must not be in past
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.expiry_date).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Expiry date cannot be in the past.");
      return;
    }
    setError("");

    try {
      //await axios.post("http://localhost:5000/api/ingredient", form);
      const res = await authFetch({
              method: "post",
              url: "http://localhost:5000/api/ingredient",
              data: form,
            });

      alert("Ingredient added!");
      setForm({ name: "", quantity: "", expiry_date: "", storage_zone_id: "" });
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving ingredient");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        //await axios.delete(`http://localhost:5000/api/ingredient/${id}`);
        const res = await authFetch({
        method: "delete",
        url: `http://localhost:5000/api/ingredient/${id}`,
        });

        alert("Ingredient deleted!");
        fetchIngredients();
      } catch (err) {
        console.error(err);
        alert("Error deleting ingredient");
      }
    }
  };

  const handleEdit = (ingredient) => {
    setEditForm({
      name: ingredient.name,
      quantity: ingredient.quantity,
      expiry_date: ingredient.expiry_date?.split("T")[0] || "",
      storage_zone_id: ingredient.storage_zone_id,
    });
    setEditId(ingredient.ingredient_id);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation: expiry date must not be in past
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(editForm.expiry_date).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setEditError("Expiry date cannot be in the past.");
      return;
    }
    setEditError("");

    try {
          const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/ingredient/${editId}`,
        data: {
        ingredient_id: editId,
        ...editForm,
        },
      });

      alert("Ingredient updated!");
      setShowEditModal(false);
      setEditId(null);
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert("Error updating ingredient");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Ingredient Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Ingredient</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

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
            <label className="block text-gray-700 mb-2 font-medium">Quantity</label>
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
            <label className="block text-gray-700 mb-2 font-medium">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]} // prevents selecting past dates
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

      {/* Ingredient List */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredient List</h2>

        {loading ? (
          <p className="text-gray-700">Loading ingredients...</p>
        ) : ingredients.length === 0 ? (
          <p className="text-gray-700">No ingredients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-gray-800">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left border-r border-blue-700">ID</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">Name</th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">
                    Quantity(kg,l,units)
                  </th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">
                    Expiry Date
                  </th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">
                    Storage Zone ID
                  </th>
                  <th className="py-3 px-4 text-left border-r border-blue-700">
                    Created At
                  </th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, idx) => (
                  <tr
                    key={ingredient.ingredient_id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-blue-100 transition-colors`}
                  >
                    <td className="py-2 px-4 border-r border-gray-300 font-medium">
                      {ingredient.ingredient_id}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {ingredient.name}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {ingredient.quantity}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {ingredient.expiry_date?.split("T")[0]}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {ingredient.storage_zone_id}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {new Date(ingredient.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.ingredient_id)}
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Update Ingredient
            </h2>

            {editError && <p className="text-red-500 mb-4">{editError}</p>}

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                name="quantity"
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm({ ...editForm, quantity: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="date"
                name="expiry_date"
                value={editForm.expiry_date}
                onChange={(e) =>
                  setEditForm({ ...editForm, expiry_date: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <input
                type="text"
                name="storage_zone_id"
                value={editForm.storage_zone_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, storage_zone_id: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManager;
