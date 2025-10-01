import React, { useState, useEffect } from "react";
import axios from "axios";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const ZoneManager = () => {
  const [form, setForm] = useState({ zone_name: "", capacity: "" });
  const [zones, setZones] = useState([]);
  const [editingZone, setEditingZone] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch zones from backend
  const fetchZones = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/store",
      });
      setZones(res.data.zone || []);
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/store",
        data: form,
      });
      alert("Zone added successfully!");
      setForm({ zone_name: "", capacity: "" });
      fetchZones();
    } catch (err) {
      console.error("Error saving zone:", err);
      alert(err.response?.data?.error || "Error saving zone");
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setForm({ zone_name: zone.zone_name, capacity: zone.capacity });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingZone.used_capacity > form.capacity) {
      return alert("Capacity cannot be smaller than used capacity!");
    }
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/store/${editingZone.storage_zone_id}`,
        data: {
          zone_name: form.zone_name,
          capacity: form.capacity,
          used_capacity: editingZone.used_capacity,
        },
      });
      alert("Zone updated successfully!");
      setShowModal(false);
      setEditingZone(null);
      fetchZones();
    } catch (err) {
      console.error("Error updating zone:", err);
      alert(err.response?.data?.error || "Error updating zone");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    try {
      const res = await authFetch({
        method: "delete",
        url: `http://localhost:5000/api/store/${id}`,
      });
      alert("Zone deleted successfully!");
      fetchZones();
    } catch (err) {
      console.error("Error deleting zone:", err);
      alert(err.response?.data?.error || "Error deleting zone");
    }
  };

  // PDF Download function
  const handleDownloadPDF = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/store/pdf",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "zones.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Error generating PDF");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* Add Zone Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-400 mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Zone</h2>
        <div className="mb-3">
          <label className="block text-gray-800 mb-1 font-semibold">Zone Name</label>
          <input
            type="text"
            name="zone_name"
            value={form.zone_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 mb-1 font-semibold">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Save Zone
        </button>
      </form>

      {/* Zones Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-400">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Storage Zones</h2>
          <button
            onClick={handleDownloadPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Download PDF
          </button>
        </div>

        <table className="w-full border border-gray-600 text-gray-900">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-600 px-4 py-2">ID</th>
              <th className="border border-gray-600 px-4 py-2">Zone Name</th>
              <th className="border border-gray-600 px-4 py-2">Capacity</th>
              <th className="border border-gray-600 px-4 py-2">Used Capacity</th>
              <th className="border border-gray-600 px-4 py-2">Created At</th>
              <th className="border border-gray-600 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.length > 0 ? (
              zones.map((zone, idx) => (
                <tr key={zone.storage_zone_id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-600 px-4 py-2">{zone.storage_zone_id}</td>
                  <td className="border border-gray-600 px-4 py-2">{zone.zone_name}</td>
                  <td className="border border-gray-600 px-4 py-2">{zone.capacity}</td>
                  <td className="border border-gray-600 px-4 py-2">{zone.used_capacity}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {zone.created_at ? new Date(zone.created_at).toLocaleDateString() : ""}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(zone.storage_zone_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-800 font-medium">
                  🚫 No zones available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Zone</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="block text-gray-800 mb-1 font-semibold">Zone Name</label>
                <input
                  type="text"
                  name="zone_name"
                  value={form.zone_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-500 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 mb-1 font-semibold">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-500 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
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

export default ZoneManager;
