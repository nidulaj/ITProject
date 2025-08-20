const { insertRecipe } = require("../models/recipeModel");

const createRecipe = async (req, res) => {
  const {
    recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
    topping1, topping2, topping3, bottom1, bottom2, bottom3
  } = req.body;

  try {
    const newRecipe = await insertRecipe(
      recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
      topping1, topping2, topping3, bottom1, bottom2, bottom3
    );

    res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
  } catch (error) {
    console.error("Error creating recipe:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all products 
const { getAllRecipes } = require('../models/recipeModel');


const getRecipes = async (req, res) => {
  try {
    const recipe = await getAllRecipes();
    res.status(200).json({ recipe });
  } catch (error) {
    console.error('Error fetching Recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update
const { updateRecipe } = require('../models/recipeModel');  // Import updateRecipe function

const updateRecipeDetails = async (req, res) => {
  const { recipe_id } = req.params;
  const {recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
        topping1, topping2, topping3, bottom1, bottom2, bottom3 } = req.body;

  try {
    const updatedRecipe = await updateRecipe(recipe_id, recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
        topping1, topping2, topping3, bottom1, bottom2, bottom3);
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Delete a product from the database
const { deleteRecipe } = require('../models/recipeModel');  // Import deleteRecipe function


const deleteRecipeDetails = async (req, res) => {
  const { recipe_id } = req.params;  // Get the recipe_no from the URL parameters

  try {
    const deletedRecipe = await deleteRecipe(recipe_id);
    res.status(200).json({ message: 'Recipe deleted successfully', recipe: deletedRecipe });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { createRecipe, getRecipes, updateRecipeDetails, deleteRecipeDetails };
