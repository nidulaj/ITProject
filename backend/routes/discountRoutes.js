const express = require('express');
const router = express.Router();
const {
  createDiscountController,
  getAllDiscountsController,
  updateDiscountController,
  deleteDiscountController
} = require('../controllers/discountController');

// Routes
router.post('/', createDiscountController);            // Create a discount
router.get('/', getAllDiscountsController);           // Get all discounts
router.put('/:discount_id', updateDiscountController); // Update a discount
router.delete('/:discount_id', deleteDiscountController); // Delete a discount

module.exports = router;
