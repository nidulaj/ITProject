import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, ArrowLeft, Upload, Eye, X, Package, AlertCircle, CheckCircle, Clock } from "lucide-react";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function ReturnsCustomer({ onBack }) {
  const empty = { product: "", customer: "", phone: "", reason: "", image_url: "" };
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image_url: file }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const formData = new FormData();
    formData.append("product", form.product);
    formData.append("customer", form.customer);
    formData.append("phone", form.phone);
    formData.append("reason", form.reason);
    if (form.image_url) {
      formData.append("image_url", form.image_url);
    }

    try {
      let response;
      if (editingId) {
        response = await axios.put(`${API}/api/returns/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data?.success) {
          setRows((r) => r.map((x) => (x.id === editingId ? response.data.data : x)));
        }
      } else {
        response = await axios.post(`${API}/api/returns`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data?.success) setRows((r) => [response.data.data, ...r]);
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

  const handleViewImage = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accept": return <CheckCircle className="w-3 h-3" />;
      case "reject": return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accept": return "bg-green-100 text-green-700 border-green-300";
      case "reject": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {typeof onBack === "function" && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">Returns Management</h1>
                  <p className="text-sm text-gray-500">Manage your product returns easily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Create/Edit Form */}
        <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-600">
                {editingId ? "Edit Return Request" : "Create New Return"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {editingId ? "Update your return information" : "Fill out the details to request a return"}
              </p>
            </div>
          </div>

          {err && (
            <div className="mb-6 p-4 rounded-xl border border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{err}</span>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Type
                </label>
                <select
                  name="product"
                  value={form.product}
                  onChange={onChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                >
                  <option value="">Select…</option>
                  <option value="customized">customized</option>
                  <option value="normal">normal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Customer Name
                </label>
                <input
                  name="customer"
                  value={form.customer}
                  onChange={onChange}
                  required
                  maxLength={120}
                  placeholder="Customer full name"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                  <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="07x xxxxxx"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Return Reason
                </label>
                <select
                  name="reason"
                  value={form.reason}
                  onChange={onChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                >
                  <option value="">Select Reason</option>
                  <option value="damaged">Damaged</option>
                  <option value="wrong_item">wrong item</option>
                  <option value="quality">quality</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Upload Image
                  <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image_url"
                    onChange={onFileChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Upload a photo of the issue (optional).</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] min-w-[140px]"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>

        {/* Returns Table */}
        <div className="bg-white shadow-xl rounded-2xl border border-blue-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-600">My Returns</h2>
                  <p className="text-sm text-gray-500">Track and manage your return requests</p>
                </div>
              </div>
              {rows.length > 0 && (
                <div className="text-sm text-gray-500">
                  {rows.length} returns
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-semibold">Loading returns...</span>
              </div>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Returns Yet</h3>
              <p className="text-gray-500 text-sm">Your return requests will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">#{r.id}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize font-medium">{r.product}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{r.customer}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{r.phone || "—"}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{r.reason}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.image_url ? (
                          <button
                            onClick={() => handleViewImage(r.image_url)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(r.status || "pending")}`}>
                          {getStatusIcon(r.status || "pending")}
                          <span className="ml-1 uppercase">{r.status || "pending"}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => editRow(r)}
                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-150"
                            title="Edit Return"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => remove(r.id)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-150"
                            title="Delete Return"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {rows.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm">
              <div className="text-gray-600">
                <strong>{rows.length}</strong> total {rows.length === 1 ? 'return' : 'returns'}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-100 border border-blue-300 rounded-full"></div>
                  <span className="text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-100 border border-green-300 rounded-full"></div>
                  <span className="text-gray-600">Accepted</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-100 border border-red-300 rounded-full"></div>
                  <span className="text-gray-600">Rejected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Return Image</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <img 
                src={`http://localhost:5000${modalImage}`} 
                alt="Return Image" 
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}