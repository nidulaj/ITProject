import React, { useState, useEffect } from "react";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const IngredientManager = () => {
  const [form, setForm] = useState({
    icode_id: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });

  const [ingredients, setIngredients] = useState([]);
  const [icodes, setIcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //search bar 
  const [searchTerm, setSearchTerm] = useState("");

  // Edit form
  const [editForm, setEditForm] = useState({
    icode_id: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState("");

  // Fetch ingredients
  const fetchIngredients = async () => {
    try {
      const res = await authFetch({ method: "get", url: "http://localhost:5000/api/ingredient" });
      if (Array.isArray(res.data)) setIngredients(res.data);
      else if (res.data.ingredients) setIngredients(res.data.ingredients);
      else setIngredients([]);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch icodes for dropdown
  const fetchIcodes = async () => {
    try {
      const res = await authFetch({ method: "get", url: "http://localhost:5000/api/icodes" });
      setIcodes(res.data);
    } catch (err) {
      console.error("Error fetching icodes:", err);
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchIcodes();
  }, []);

  // Form change handler
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add new ingredient
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: expiry date
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.expiry_date).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Expiry date cannot be in the past.");
      return;
    }

    // Validation: quantity
    if (form.quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    setError("");

    try {
      await authFetch({ method: "post", url: "http://localhost:5000/api/ingredient", data: form });
      alert("Ingredient added!");
      setForm({ icode_id: "", quantity: "", expiry_date: "", storage_zone_id: "" });
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving ingredient");
    }
  };

  // Delete ingredient
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await authFetch({ method: "delete", url: `http://localhost:5000/api/ingredient/${id}` });
        alert("Ingredient deleted!");
        fetchIngredients();
      } catch (err) {
        console.error(err);
        alert("Error deleting ingredient");
      }
    }
  };

  // Open edit modal
  const handleEdit = (ingredient) => {
    setEditForm({
      icode_id: ingredient.icode_id,
      quantity: ingredient.quantity,
      expiry_date: ingredient.expiry_date?.split("T")[0] || "",
      storage_zone_id: ingredient.storage_zone_id,
    });
    setEditId(ingredient.ingredient_id);
    setShowEditModal(true);
  };

  // Update ingredient
  const handleUpdate = async (e) => {
    e.preventDefault();

    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(editForm.expiry_date).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setEditError("Expiry date cannot be in the past.");
      return;
    }

    // Validation: quantity
    if (editForm.quantity <= 0) {
      setEditError("Quantity must be greater than 0.");
      return;
    }

    setEditError("");

    try {
      await authFetch({ method: "put", url: `http://localhost:5000/api/ingredient/${editId}`, data: editForm });
      alert("Ingredient updated!");
      setShowEditModal(false);
      setEditId(null);
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert("Error updating ingredient");
    }
  };

  // Download Report
  const downloadReport = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ingredientReport", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ingredients_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  // --- filter ingredients by search term ---
  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.ingredient_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.icode_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Add Ingredient Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Add Ingredient</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">ICode</label>
            <select
              name="icode_id"
              value={form.icode_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select ICode</option>
              {icodes.map((icode) => (
                <option key={icode.ingredient_id} value={icode.ingredient_id}>
                  {icode.ingredient_code} - {icode.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Quantity(l,kg,units)</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border rounded-lg"
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
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Storage Zone ID</label>
            <input
              type="text"
              name="storage_zone_id"
              value={form.storage_zone_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg">
          Save
        </button>
      </form>

      {/* report*/}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ingredient List</h2>
          <button
            onClick={downloadReport}
            className="bg-blue-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Download Report
          </button>
        </div>

        {/* --- Search bar --- */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by ICode or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {loading ? (
          <p className="text-gray-700">Loading ingredients...</p>
        ) : filteredIngredients.length === 0 ? (
          <p className="text-gray-700">No ingredients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-gray-800">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 border-r border-blue-700">ID</th>
                  <th className="py-3 px-4 border-r border-blue-700">ICode</th>
                  <th className="py-3 px-4 border-r border-blue-700">Quantity(l,kg,units)</th>
                  <th className="py-3 px-4 border-r border-blue-700">Expiry Date</th>
                  <th className="py-3 px-4 border-r border-blue-700">Storage Zone ID</th>
                  <th className="py-3 px-4 border-r border-blue-700">Created At</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((ingredient, idx) => (
                  <tr
                    key={ingredient.ingredient_id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-blue-100 transition-colors`}
                  >
                    <td className="py-2 px-4 border-r border-gray-300 font-medium">{ingredient.ingredient_id}</td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {ingredient.ingredient_code} - {ingredient.icode_name}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.quantity}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.expiry_date?.split("T")[0]}</td>
                    <td className="py-2 px-4 border-r border-gray-300">{ingredient.storage_zone_id}</td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {new Date(ingredient.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.ingredient_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Ingredient</h2>
            {editError && <p className="text-red-500 mb-4">{editError}</p>}
            <form onSubmit={handleUpdate} className="space-y-4">
              <select
                name="icode_id"
                value={editForm.icode_id}
                onChange={(e) => setEditForm({ ...editForm, icode_id: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select ICode</option>
                {icodes.map((icode) => (
                  <option key={icode.ingredient_id} value={icode.ingredient_id}>
                    {icode.ingredient_code} - {icode.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="quantity"
                value={editForm.quantity}
                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
                min="1"
              />
              <input
                type="date"
                name="expiry_date"
                value={editForm.expiry_date}
                onChange={(e) => setEditForm({ ...editForm, expiry_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                min={new Date().toISOString().split("T")[0]}
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
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700">
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
