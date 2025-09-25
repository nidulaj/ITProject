// src/components/RecipeUpdateForm.jsx
import React, { useState } from "react";
import axios from "axios";

function RecipeUpdateForm({ recipe, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    recipe_no: recipe.recipe_no || "",
    recipe_name: recipe.recipe_name || "",
    strawberry: recipe.strawberry ?? "",
    mango: recipe.mango ?? "",
    blueberry: recipe.blueberry ?? "",
    milk: recipe.milk ?? "",
    culture: recipe.culture ?? "",
    sugar: recipe.sugar ?? "",
    topping1: recipe.topping1 ?? "",
    topping2: recipe.topping2 ?? "",
    topping3: recipe.topping3 ?? "",
    bottom1: recipe.bottom1 ?? "",
    bottom2: recipe.bottom2 ?? "",
    bottom3: recipe.bottom3 ?? ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("🔎 Sending update request:", {
        id: recipe.recipe_id,
        body: formData,
      });

      // ✅ Correct backend URL
      const res = await axios.put(
        `http://localhost:5000/api/recipe/${recipe.recipe_id}`,
        formData
      );

      console.log("✅ Update response:", res.data);

      const updatedRecipe = res.data.recipe || formData;
      alert("✅ Recipe updated successfully!");

      if (onSuccess) onSuccess(updatedRecipe); // update parent state
      if (onCancel) onCancel(); // close modal
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      alert("❌ Failed to update recipe. Check console for details.");
    }
  };

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      {Object.keys(formData).map((field) => (
        <div key={field} className="flex flex-col">
          <label className="text-gray-700 text-sm mb-1">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required={field === "recipe_no" || field === "recipe_name"}
            className="p-2 border rounded-md"
          />
        </div>
      ))}
      <div className="col-span-2 flex justify-end space-x-2 mt-4">
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

export default RecipeUpdateForm;
