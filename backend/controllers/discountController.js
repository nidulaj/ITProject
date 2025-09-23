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

// ---------------- Discount Logic ----------------

// Check if discount is currently active (for seasonal offers)
function isDiscountActive(discount) {
  const today = new Date();
  return today >= new Date(discount.valid_from) && today <= new Date(discount.valid_to);
}

// Check eligibility based on criteria
function isEligible(totalPrice, discount) {
  const criteria = discount.eligibility_criteria;

  if (!criteria) return true; // No criteria → eligible by default

  if (criteria === "seasonal") {
    // Seasonal offers are handled by isDiscountActive
    return true;
  }

  // Total price thresholds
  if (criteria.startsWith("totalPrice>")) {
    const minPrice = parseFloat(criteria.split(">")[1]);
    return totalPrice >= minPrice;
  }

  // Default to eligible if unknown criteria
  return true;
}

// Apply discount based on type
function applyDiscount(totalPrice, discount) {
  if (discount.discount_type === "Percentage") {
    return totalPrice - (totalPrice * (discount.value / 100));
  } else if (discount.discount_type === "Fixed") {
    return totalPrice - discount.value;
  }
  return totalPrice;
}

// Calculate the best discount among eligible discounts
function calculateBestDiscount(totalPrice, discounts) {
  let bestPrice = totalPrice;
  let bestDiscount = null;

  discounts.forEach(discount => {
    // For seasonal offers, check the date validity
    if (discount.eligibility_criteria === "seasonal" && !isDiscountActive(discount)) {
      return; // skip if seasonal and not active
    }

    // Check total price / other eligibility
    if (isEligible(totalPrice, discount)) {
      const discountedPrice = applyDiscount(totalPrice, discount);
      if (discountedPrice < bestPrice) {
        bestPrice = discountedPrice;
        bestDiscount = discount;
      }
    }
  });

  return {
    originalPrice: totalPrice,
    finalPrice: bestPrice,
    discountApplied: bestDiscount
  };
}

// ---------------- Controllers ----------------

// Apply best discount
const applyBestDiscount = async (req, res) => {
  try {
    const { totalPrice } = req.body;

    if (!totalPrice) {
      return res.status(400).json({ error: "Total price is required" });
    }

    const discounts = await getAllDiscounts();
    const result = calculateBestDiscount(totalPrice, discounts);

    res.json(result);
  } catch (error) {
    console.error("Error applying discount:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDiscountController,
  getAllDiscountsController,
  updateDiscountController,
  deleteDiscountController,
  applyBestDiscount //changed
};




