const { createDiscount, getAllDiscounts, updateDiscount, deleteDiscount } = require('../models/discountModel');

// Create a new discount
const createDiscountController = async (req, res) => {
  try {
    const { discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to } = req.body;
    const newDiscount = await createDiscount(discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to);
    res.status(201).json(newDiscount);
  } catch (error) {
    console.error("create discount error : ",error)
    res.status(500).json({ message: error.message });
  }
};

// Get all discounts
const getAllDiscountsController = async (req, res) => {
  try {
    const discounts = await getAllDiscounts();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a discount
const updateDiscountController = async (req, res) => {
  try {
    const { discount_id } = req.params;
    const { discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to } = req.body;
    const updatedDiscount = await updateDiscount(discount_id, discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to);
    
    if (!updatedDiscount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    
    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a discount
const deleteDiscountController = async (req, res) => {
  try {
    const { discount_id } = req.params;
    const deletedDiscount = await deleteDiscount(discount_id);
    res.status(200).json(deletedDiscount);
  } catch (error) {
    if (error.message === "Discount not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDiscountController,
  getAllDiscountsController,
  updateDiscountController,
  deleteDiscountController
};
