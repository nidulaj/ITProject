import React, { useState, useEffect } from "react";
import axios from "axios";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const TableFinalProductForm = () => {
  const [form, setForm] = useState({
    pname: "",
    batch_no: "",
    quantity: "",
    expiry_date: "",
    storage_zone_id: "",
  });

  const [finalProducts, setFinalProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // for popup

  // Fetch all products
  const fetchFinalProducts = async () => {
    try {
      //const res = await axios.get("http://localhost:5000/api/final");
      const res = await authFetch({
                  method: "get",
                  url: "http://localhost:5000/api/final",
                });

      setFinalProducts(res.data.finalProduct || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchFinalProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     // await axios.post("http://localhost:5000/api/final", form);

     const res = await authFetch({
                         method: "post",
                         url: "http://localhost:5000/api/final",
                         data: form,
                       });

      alert("Product added successfully!");
      setForm({ pname: "", batch_no: "", quantity: "", expiry_date: "", storage_zone_id: "" });
      fetchFinalProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product");
    }
  };

  const handleEditClick = (product) => {
    setEditProduct({
      ...product,
      expiry_date: product.expiry_date?.split("T")[0],
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
    const res = await authFetch({
    method: "put",
    url: `http://localhost:5000/api/final/${editProduct.fproduct_id}`,
    data: {
    fproduct_id: editProduct.fproduct_id,
    pname: editProduct.pname,
    batch_no: editProduct.batch_no,
    quantity: editProduct.quantity,
    expiry_date: editProduct.expiry_date,
    storage_zone_id: editProduct.storage_zone_id,
  },
});

      alert("Product updated successfully!");
      setEditProduct(null);
      fetchFinalProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      //await axios.delete(`http://localhost:5000/api/final/${id}`);
      const res = await authFetch({
                      method: "delete",
                      url: `http://localhost:5000/api/final/${id}`,
                      });
      alert("Product deleted successfully!");
      fetchFinalProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Add Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Add Final Product
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="pname"
              value={form.pname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Batch Number</label>
            <input
              type="text"
              name="batch_no"
              value={form.batch_no}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Storage Zone ID</label>
            <input
              type="text"
              name="storage_zone_id"
              value={form.storage_zone_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Save
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Final Products List
        </h2>
        <table className="w-full border border-gray-600 text-gray-900">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-600 px-4 py-2">ID</th>
              <th className="border border-gray-600 px-4 py-2">Product Name</th>
              <th className="border border-gray-600 px-4 py-2">Batch No</th>
              <th className="border border-gray-600 px-4 py-2">Quantity</th>
              <th className="border border-gray-600 px-4 py-2">Expiry Date</th>
              <th className="border border-gray-600 px-4 py-2">Storage Zone ID</th>
              <th className="border border-gray-600 px-4 py-2">Created At</th>
              <th className="border border-gray-600 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {finalProducts.length > 0 ? (
              finalProducts.map((p, idx) => (
                <tr
                  key={p.fproduct_id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-600 px-4 py-2">{p.fproduct_id}</td>
                  <td className="border border-gray-600 px-4 py-2">{p.pname}</td>
                  <td className="border border-gray-600 px-4 py-2">{p.batch_no}</td>
                  <td className="border border-gray-600 px-4 py-2">{p.quantity}</td>
                  <td className="border border-gray-600 px-4 py-2">{p.expiry_date?.split("T")[0]}</td>
                  <td className="border border-gray-600 px-4 py-2">{p.storage_zone_id}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.fproduct_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-800 font-medium">
                  🚫 No final products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Update Final Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="pname"
                value={editProduct.pname}
                onChange={(e) => setEditProduct({ ...editProduct, pname: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="batch_no"
                value={editProduct.batch_no}
                onChange={(e) => setEditProduct({ ...editProduct, batch_no: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <input
                type="number"
                name="quantity"
                value={editProduct.quantity}
                onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <input
                type="date"
                name="expiry_date"
                value={editProduct.expiry_date}
                onChange={(e) => setEditProduct({ ...editProduct, expiry_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="storage_zone_id"
                value={editProduct.storage_zone_id}
                onChange={(e) => setEditProduct({ ...editProduct, storage_zone_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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

export default TableFinalProductForm;
