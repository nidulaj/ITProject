// src/components/RequestIngredientsUpdateForm.jsx
import React, { useState } from "react";

function RequestIngredientsUpdateForm({ request, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(request);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData); // pass updated data to parent (API call handled there)
  };

  return (
    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
      {/* Recipe No (disabled) */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm mb-1">Recipe No</label>
        <input
          type="text"
          name="recipe_no"
          value={formData.recipe_no || ""}
          disabled
          className="p-2 border rounded-md bg-gray-100"
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity || ""}
          onChange={handleChange}
          required
          className="p-2 border rounded-md"
        />
      </div>

      {/* Buttons */}
      <div className="col-span-1 flex justify-end space-x-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default RequestIngredientsUpdateForm;
