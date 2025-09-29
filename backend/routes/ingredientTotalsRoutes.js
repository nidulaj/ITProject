const express = require('express');
const router = express.Router();
const {
  calculateTotals,
  getIngredientTotals,
} = require('../controllers/ingredientTotalsController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Ingredient totals API is working!' });
});

// Calculate totals from ingredients table
router.post('/calculate', calculateTotals);

// Get all ingredient totals
router.get('/', getIngredientTotals);

module.exports = router;