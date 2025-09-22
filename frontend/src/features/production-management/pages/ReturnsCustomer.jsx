import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Image, ArrowLeft } from "lucide-react";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function ReturnsCustomer({ onBack }) {
  const empty = { product: "", customer: "", phone: "", reason: "", image_url: "" };
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/returns`);
      setRows(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (editingId) {
        const { data } = await axios.put(`${API}/api/returns/${editingId}`, form);
        if (data?.success) {
          setRows((r) => r.map((x) => (x.id === editingId ? data.data : x)));
        }
      } else {
        const { data } = await axios.post(`${API}/api/returns`, form);
        if (data?.success) setRows((r) => [data.data, ...r]);
      }
      setForm(empty);
      setEditingId(null);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    }
  };

  const editRow = (row) => {
    setEditingId(row.id);
    setForm({
      product: row.product,
      customer: row.customer,
      phone: row.phone || "",
      reason: row.reason,
      image_url: row.image_url || "",
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this return?")) return;
    try {
      await axios.delete(`${API}/api/returns/${id}`);
      setRows((r) => r.filter((x) => x.id !== id));
      if (editingId === id) { setEditingId(null); setForm(empty); }
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  const badge = (s) =>
    s === "accept" ? "bg-green-100 text-green-800"
    : s === "reject" ? "bg-red-100 text-red-800"
    : "bg-yellow-100 text-yellow-800";

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Back bar (only if onBack provided) */}
      {typeof onBack === "function" && (
        //<div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl  px-6 py-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span className="text-lg"><ArrowLeft/></span>
              Back
            </button>
          </div>
        //</div>
      )}

      <div className="p-6 space-y-6">
        {/* Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">
              {editingId ? "Edit Return" : "Create Return"}
            </h2>
          </div>

          {err && (
            <div className="mb-6 p-4 rounded-xl border border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-sm">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {err}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                Product
              </label>
              <select
                name="product"
                value={form.product}
                onChange={onChange}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
              >
                <option value="">Select…</option>
                <option value="customized">customized</option>
                <option value="normal">normal</option>
              </select>
            </div>

            {/* Customer */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                Customer
              </label>
              <input
                name="customer"
                value={form.customer}
                onChange={onChange}
                required
                maxLength={120}
                placeholder="Customer full name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
              />
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="07x xxxxxx"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>

            {/* Reason */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                Reason
              </label>
              <select
                name="reason"
                value={form.reason}
                onChange={onChange}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
              >
                <option value="">Select Reason</option>
                <option value="damaged">Damaged</option>
                <option value="Wrong Item">wrong item</option>
                <option value="Quality">quality</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2 group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                Image (URL)
              </label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={onChange}
                placeholder="https://… (optional)"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">Add a link to a photo of the issue (optional).</p>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(empty); }}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px]"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-blue-100 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">My Returns</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      Return ID
                    </div>
                  </th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Product</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Customer</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Phone</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Reason</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Image</th>
                  <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Status</th>
                  <th className="p-4 text-center font-semibold text-sm uppercase tracking-wide">Actions</th>
                </tr>
              </thead>

              {/* 🔽 Your tbody block is unchanged below */}
              <tbody className="divide-y divide-gray-100">
                {/* Loading state */}
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="inline-flex items-center gap-3 text-blue-700">
                        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="font-semibold">Loading…</span>
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  // Empty state (matches CustomOrderTable vibe)
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-3xl text-gray-400">📦</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Returns Yet</h3>
                        <p className="text-gray-500">Your product returns will appear here once submitted.</p>
                        <div className="mt-4 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">💡 Fill the form above to create your first return.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50 transition-all duration-200 group">
                      <td className="p-4">
                        <span className="text-blue-600 font-bold text-sm">{r.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-800 capitalize">{r.product}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-800">{r.customer}</span>
                      </td>
                      <td className="p-4">{r.phone || "—"}</td>
                      <td className="p-4 capitalize">{r.reason}</td>
                      <td className="p-4">
                        {r.image_url ? (
                          <a href={r.image_url} target="_blank" rel="noreferrer" title="Open image">
                            {/* 1:1 thumbnail, clipped & tidy */}
                            <div className="relative  ">
                              <Image className="w-6 h-6 text-black"
                                src={r.image_url}
                                alt="return"
                                draggable={false}
                              />
                            </div>
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4">
                        {/* Gradient status pill with emoji (pending/accept/reject) */}
                        <span
                          className={`px-3 py-2 text-xs font-bold rounded-full shadow-sm border-2 inline-flex items-center gap-1
                            ${
                              (r.status || "pending") === "pending"
                                ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                                : r.status === "accept"
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                                : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
                            }`}
                        >
                          {(r.status || "pending") === "pending" && "⏳"}
                          {r.status === "accept" && "✅"}
                          {r.status === "reject" && "❌"}
                          <span className="uppercase ml-1">{(r.status || "pending")}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => editRow(r)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                            title="Edit Return"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => remove(r.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                            title="Delete Return"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* 🔼 Unchanged tbody ends here */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
