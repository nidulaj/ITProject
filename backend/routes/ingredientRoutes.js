/*const express = require('express');
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




module.exports = router;*/
const express = require('express');
const router = express.Router();
const {
  addIngredient,
  getIngredients,
  updateIngredientDetails,
  deleteIngredientDetails,
} = require('../controllers/ingredientsController');

// Create
router.post('/', addIngredient);

// Read all
router.get('/', getIngredients);

// Update
router.put('/:id', updateIngredientDetails);

// Delete
router.delete('/:id', deleteIngredientDetails);

module.exports = router;
