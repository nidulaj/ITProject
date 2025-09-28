const { createDiscount, getAllDiscounts, updateDiscount, deleteDiscount, getDiscountByCode } = require('../models/discountModel');


const createDiscountController = async (req, res) => {
  try {
    const { discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to, discount_code } = req.body;
    
    // Validate that discount_code is provided
    if (!discount_code) {
      return res.status(400).json({ message: "Discount code is required" });
    }
    
    const newDiscount = await createDiscount(discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to, discount_code);
    res.status(201).json(newDiscount);
  } catch (error) {
    console.error("create discount error : ",error)
    res.status(500).json({ message: error.message });
  }
};


const getAllDiscountsController = async (req, res) => {
  try {
    const discounts = await getAllDiscounts();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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



function isDiscountActive(discount) {
  const today = new Date();
  return today >= new Date(discount.valid_from) && today <= new Date(discount.valid_to);
}


function isEligible(totalPrice, discount) {
  const criteria = discount.eligibility_criteria;

  if (!criteria) return true; 

  if (criteria === "seasonal") {
    return true;
  }

  
  if (criteria.startsWith("totalPrice>")) {
    const minPrice = parseFloat(criteria.split(">")[1]);
    return totalPrice >= minPrice;
  }

  return true;
}


function applyDiscount(totalPrice, discount) {
  if (discount.discount_type === "Percentage") {
    return totalPrice - (totalPrice * (discount.value / 100));
  } else if (discount.discount_type === "Fixed") {
    return totalPrice - discount.value;
  }
  return totalPrice;
}


function calculateBestDiscount(totalPrice, discounts) {
  let bestDiscountAmount = 0;
  let bestDiscount = null;
  let bestFinalPrice = totalPrice;

  discounts.forEach(discount => {
    // Check if discount is active (has valid dates)
    if (discount.valid_from && discount.valid_to && !isDiscountActive(discount)) {
      return;
    }

    // Check eligibility criteria
    if (isEligible(totalPrice, discount)) {
      let discountAmount = 0;
      let finalPrice = totalPrice;

      if (discount.discount_type === "percentage" || discount.discount_type === "Percentage") {
        discountAmount = totalPrice * (discount.value / 100);
        finalPrice = totalPrice - discountAmount;
      } else if (discount.discount_type === "fixed" || discount.discount_type === "Fixed") {
        discountAmount = Math.min(discount.value, totalPrice); // Can't discount more than total
        finalPrice = totalPrice - discountAmount;
      }

      // Choose the discount that gives the largest discount amount
      if (discountAmount > bestDiscountAmount) {
        bestDiscountAmount = discountAmount;
        bestDiscount = discount;
        bestFinalPrice = finalPrice;
      }
    }
  });

  return {
    originalPrice: totalPrice,
    finalPrice: bestFinalPrice,
    discountAmount: bestDiscountAmount,
    discountApplied: bestDiscount
  };
}


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

// Validate and apply discount code
const validateDiscountCode = async (req, res) => {
  try {
    const { discount_code, totalPrice } = req.body;

    if (!discount_code || !totalPrice) {
      return res.status(400).json({ error: "Discount code and total price are required" });
    }

    console.log("🔍 Validating discount code:", discount_code, "for total:", totalPrice);

    // Get discount by code
    const discount = await getDiscountByCode(discount_code);
    
    if (!discount) {
      return res.status(404).json({ 
        valid: false, 
        error: "Invalid discount code" 
      });
    }

    console.log("📊 Found discount:", discount.discount_name);

    // Check if discount is active - DISABLED FOR TESTING
    console.log("📅 Date validation disabled for testing");
    
    // Skip date validation for now
    // const today = new Date();
    // const validFrom = new Date(discount.valid_from);
    // const validTo = new Date(discount.valid_to);
    // 
    // if (today < validFrom || today > validTo) {
    //   return res.status(400).json({ 
    //     valid: false, 
    //     error: "Discount code has expired" 
    //   });
    // }

    // Check eligibility
    const criteria = discount.eligibility_criteria;
    let isEligible = true;

    if (criteria && criteria.startsWith("totalprice>")) {
      const minPrice = parseFloat(criteria.split(">")[1]);
      isEligible = totalPrice >= minPrice;
    }

    if (!isEligible) {
      return res.status(400).json({ 
        valid: false, 
        error: "Order total does not meet discount requirements" 
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    let finalPrice = totalPrice;

    if (discount.discount_type === "percentage" || discount.discount_type === "Percentage") {
      const percentageValue = parseFloat(discount.value);
      discountAmount = totalPrice * (percentageValue / 100);
      finalPrice = totalPrice - discountAmount;
    } else if (discount.discount_type === "fixed" || discount.discount_type === "Fixed") {
      const fixedValue = parseFloat(discount.value);
      discountAmount = Math.min(fixedValue, totalPrice);
      finalPrice = totalPrice - discountAmount;
    }

    console.log("💰 Discount calculation:", {
      originalPrice: totalPrice,
      discountAmount,
      finalPrice,
      discountName: discount.discount_name
    });

    res.json({
      valid: true,
      discount: {
        id: discount.discount_id,
        name: discount.discount_name,
        type: discount.discount_type,
        value: discount.value,
        code: discount.discount_code
      },
      originalPrice: totalPrice,
      discountAmount,
      finalPrice
    });

  } catch (error) {
    console.error("Error validating discount code:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDiscountController,
  getAllDiscountsController,
  updateDiscountController,
  deleteDiscountController,
  applyBestDiscount,
  validateDiscountCode
};

