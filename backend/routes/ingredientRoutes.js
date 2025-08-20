const express = require('express');
const router = express.Router();
const { addIngredient, getIngredients, updateIngredientDetails,deleteIngredientDetails} = require('../controllers/ingredientsController');
// POST /api/ingredient → Create a new ingredient
router.post('/', addIngredient);

// GET /api/ingredient → Fetch all ingredients
router.get('/', getIngredients);

// Route to update a product
router.put('/:id', updateIngredientDetails);

// Route to delete a product
router.delete('/:id', deleteIngredientDetails);




module.exports = router;

