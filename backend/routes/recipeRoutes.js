const express = require("express");
const router = express.Router();

const { createRecipe, getRecipes, updateRecipeDetails, deleteRecipeDetails } = require("../controllers/recipeController");
const {staffAuthMiddleware} = require("../middlewares/staffAuthMiddleware")
 
// POST /recipe/createRecipe
router.post('/',staffAuthMiddleware, createRecipe);


// Route to get all products (optional)
router.get('/',staffAuthMiddleware, getRecipes);


// Route to update a product
router.put('/:recipe_id',staffAuthMiddleware, updateRecipeDetails);


// Route to delete a product
router.delete('/:recipe_id',staffAuthMiddleware, deleteRecipeDetails);




module.exports = router;
