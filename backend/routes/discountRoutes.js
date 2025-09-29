const express = require('express');
const router = express.Router();
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");

const {
  createDiscountController,
  getAllDiscountsController,
  updateDiscountController,
  deleteDiscountController,
  applyBestDiscount,
  validateDiscountCode
} = require('../controllers/discountController');


router.post('/', staffAuthMiddleware, createDiscountController);            
router.get('/', staffAuthMiddleware, getAllDiscountsController);            
router.put('/:discount_id', staffAuthMiddleware, updateDiscountController); 
router.delete('/:discount_id', staffAuthMiddleware, deleteDiscountController); 
router.post("/apply", staffAuthMiddleware, applyBestDiscount);
router.post("/validate-code", validateDiscountCode); // No auth required for customers

module.exports = router;
