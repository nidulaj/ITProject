const express = require('express');
const router = express.Router();
const {
  createDiscountController,
  getAllDiscountsController,
  updateDiscountController,
  deleteDiscountController,
  applyBestDiscount
} = require('../controllers/discountController');


router.post('/', createDiscountController);            
router.get('/', getAllDiscountsController);            
router.put('/:discount_id', updateDiscountController); 
router.delete('/:discount_id', deleteDiscountController); 
router.post("/apply", applyBestDiscount);

module.exports = router;
