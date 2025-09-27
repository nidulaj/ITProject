import React, { useEffect, useState } from "react";
import axios from "axios";

const IcodePage = () => {
  const [icodes, setIcodes] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const fetchIcodes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/icodes"); // ✅ safer full URL
      setIcodes(res.data);
    } catch (err) {
      console.error("Failed to fetch icodes:", err);
    }
  };

  useEffect(() => {
    fetchIcodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/icodes/${editing}`, { name });
        setEditing(null);
      } else {
        await axios.post("http://localhost:5000/api/icodes", { name });
      }
      setName("");
      fetchIcodes();
    } catch (err) {
      console.error("Error saving icode:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/icodes/${id}`);
      fetchIcodes();
    } catch (err) {
      console.error("Error deleting icode:", err);
    }
  };

  const handleEdit = (id, name) => {
    setEditing(id);
    setName(name);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Icode Management ✅</h1> 
      {/* Added "✅" so you know page actually rendered */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter name"
          className="border p-2 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {icodes.map((ic) => (
            <tr key={ic.ingredient_id}>
              <td className="p-2 border">{ic.ingredient_code}</td>
              <td className="p-2 border">{ic.name}</td>
              <td className="p-2 border">
                {new Date(ic.created_at).toLocaleString()}
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(ic.ingredient_id, ic.name)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ic.ingredient_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {icodes.length === 0 && (
            <tr>
              <td colSpan="4" className="p-2 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IcodePage;
