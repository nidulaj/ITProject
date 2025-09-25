// src/components/RecipeForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeUpdateForm from "./RecipeUpdateForm";
import RequestIngredientsForm from "./RequestIngredientsForm"; // import added
import Modal from "./Modal";
import { Package, Edit, Trash2 } from "lucide-react";

function RecipeForm() {
  const initialForm = {
    recipe_no: "",
    recipe_name: "",
    strawberry: "",
    mango: "",
    blueberry: "",
    milk: "",
    culture: "",
    sugar: "",
    topping1: "",
    topping2: "",
    topping3: "",
    bottom1: "",
    bottom2: "",
    bottom3: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  State for ingredient request modal
  const [requestingRecipe, setRequestingRecipe] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleRequestClick = (recipe) => {
    setRequestingRecipe(recipe);
    setIsRequestModalOpen(true);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/recipe");
      setRecipes(res.data.recipe || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert empty strings to null
    const payload = {};
    Object.keys(formData).forEach((key) => {
      payload[key] = formData[key].trim() === "" ? null : formData[key];
    });

    try {
      const res = await axios.post("http://localhost:5000/api/recipe", payload);
      if (res.data.recipe) {
        setRecipes([...recipes, res.data.recipe]);
        alert("✅ Recipe added successfully!");
        setFormData(initialForm); // reset form
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add recipe.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/recipe/${id}`);
      setRecipes(recipes.filter((r) => r.recipe_id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete recipe.");
    }
  };

  const handleEditClick = (recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleUpdateSuccess = (updatedRecipe) => {
    setRecipes(
      recipes.map((r) =>
        r.recipe_id === updatedRecipe.recipe_id ? updatedRecipe : r
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Add Recipe Form */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Recipe</h2>
        <form className="grid grid-cols-4 gap-4" onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={
            // Manually setting the placeholder values for each field
            field === "recipe_no" ? "Enter Recipe Number" :
            field === "recipe_name" ? "Enter Recipe Name" :
            field === "strawberry" ? "Srawberry (g)" :
            field === "mango" ? "Mango (g)" :
            field === "blueberry" ? "Blueberry (g)" :
            field === "milk" ? "Milk (ml)" :
            field === "culture" ? "Culture (g)" :
            field === "sugar" ? "Sugar (g)" :
            field === "topping1" ? "Chocolate Syrup (ml)" :
            field === "topping2" ? "Strawberry Syrup (ml)" :
            field === "topping3" ? "Honey Syrup (ml)" :
            field === "bottom1" ? "Cashew (g)" :
            field === "bottom2" ? "Peanut (g)" :
            field === "bottom3" ? "Armond (g)" :
            "Enter Value"
              }
              value={formData[field]}
              onChange={handleChange}
              required={field === "recipe_no" || field === "recipe_name"}
              className="p-2 border rounded-md"
            />
          ))}
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Recipe
            </button>
          </div>
        </form>
      </div>

      {/* Recipe Table */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Recipes</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">No</th>
                <th className="p-2">Strawberry</th>
                <th className="p-2">Mango</th>
                <th className="p-2">Blueberry</th>
                <th className="p-2">Milk</th>
                <th className="p-2">Culture</th>
                <th className="p-2">Sugar</th>
                <th className="p-2">Top_1</th>
                <th className="p-2">Top_2</th>
                <th className="p-2">Top_3</th>
                <th className="p-2">Bottom1</th>
                <th className="p-2">Bottom2</th>
                <th className="p-2">Bottom3</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr
                  key={recipe.recipe_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-2">{recipe.recipe_name}</td>
                  <td className="p-2">{recipe.recipe_no}</td>
                  <td className="p-2">{recipe.strawberry}</td>
                  <td className="p-2">{recipe.mango}</td>
                  <td className="p-2">{recipe.blueberry}</td>
                  <td className="p-2">{recipe.milk}</td>
                  <td className="p-2">{recipe.culture}</td>
                  <td className="p-2">{recipe.sugar}</td>
                  <td className="p-2">{recipe.topping1}</td>
                  <td className="p-2">{recipe.topping2}</td>
                  <td className="p-2">{recipe.topping3}</td>
                  <td className="p-2">{recipe.bottom1}</td>
                  <td className="p-2">{recipe.bottom2}</td>
                  <td className="p-2">{recipe.bottom3}</td>
                  <td className="p-2 space-x-2 text-center">
                    {/* Green button opens request modal */}
                    <button
                      onClick={() => handleRequestClick(recipe)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Package size={16} />
                    </button>

                    <button
                      onClick={() => handleEditClick(recipe)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(recipe.recipe_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Update */}
      {editingRecipe && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Update Recipe"
          size="large"
        >
          <RecipeUpdateForm
            recipe={editingRecipe}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {/* Modal for Request Ingredients */}
      {requestingRecipe && (
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title="Request Ingredients"
          size="medium"
        >
          <RequestIngredientsForm
            recipeNo={requestingRecipe.recipe_no}
            onSuccess={() => setIsRequestModalOpen(false)}
            onCancel={() => setIsRequestModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default RecipeForm;
