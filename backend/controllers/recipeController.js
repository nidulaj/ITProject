// controllers/recipeController.js
const { insertRecipe, getAllRecipes, updateRecipe, deleteRecipe } = require("../models/recipeModel");

// Create
const createRecipe = async (req, res) => {
  try {
    // accept both snake_case and camelCase just in case
    const order_no = (req.body.order_no ?? req.body.orderNo)?.trim();
    const recipe_name = (req.body.recipe_name ?? req.body.recipeName)?.trim();

    if (!order_no || !recipe_name) {
      return res.status(400).json({ error: "order_no and recipe_name are required" });
    }

    
    if (recipe_name.length < 3) {
    return res.status(400).json({ error: "recipe_name must be at least 3 characters long" });
    }
    

    const newRecipe = await insertRecipe(
      order_no,
      recipe_name,
      req.body.strawberry,
      req.body.mango,
      req.body.blueberry,
      req.body.milk,
      req.body.culture,
      req.body.sugar,
      req.body.topping1,
      req.body.topping2,
      req.body.topping3,
      req.body.bottom1,
      req.body.bottom2,
      req.body.bottom3
    );

    return res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
  } catch (error) {
    if (error.code === '23503') {
      // FK violation: order_no not found
      return res.status(400).json({ error: "Invalid order_no (not found in customized orders)" });
    }
    console.error("Error creating recipe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Read
const getRecipes = async (req, res) => {
  try {
    const recipe = await getAllRecipes();
    return res.status(200).json({ recipe });
  } catch (error) {
    console.error("Error fetching Recipes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update
const updateRecipeDetails = async (req, res) => {
  try {
    const { recipe_id } = req.params;

    const order_no = (req.body.order_no ?? req.body.orderNo)?.trim();
    const recipe_name = (req.body.recipe_name ?? req.body.recipeName)?.trim();

    if (!order_no || !recipe_name) {
      return res.status(400).json({ error: "order_no and recipe_name are required" });
    }

    const updatedRecipe = await updateRecipe(
      recipe_id,
      order_no,
      recipe_name,
      req.body.strawberry,
      req.body.mango,
      req.body.blueberry,
      req.body.milk,
      req.body.culture,
      req.body.sugar,
      req.body.topping1,
      req.body.topping2,
      req.body.topping3,
      req.body.bottom1,
      req.body.bottom2,
      req.body.bottom3
    );

    return res.status(200).json({ message: "Recipe updated successfully", recipe: updatedRecipe });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ error: "Invalid order_no (not found in customized orders)" });
    }
    console.error("Error updating recipe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete
const deleteRecipeDetails = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const deletedRecipe = await deleteRecipe(recipe_id);
    return res.status(200).json({ message: "Recipe deleted successfully", recipe: deletedRecipe });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createRecipe, getRecipes, updateRecipeDetails, deleteRecipeDetails };
