const express = require("express");
const router = express.Router();

const { createRecipe, getRecipes, updateRecipeDetails, deleteRecipeDetails } = require("../controllers/recipeController");
 
// POST /recipe/createRecipe
router.post('/', createRecipe);


// Route to get all products (optional)
router.get('/', getRecipes);


// Route to update a product
router.put('/:recipe_id', updateRecipeDetails);


// Route to delete a product
router.delete('/:recipe_id', deleteRecipeDetails);




module.exports = router;
