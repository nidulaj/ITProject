function isDiscountActive(discount) {
  const today = new Date();
  return today >= new Date(discount.valid_from) && today <= new Date(discount.valid_to);
}

function isEligible(totalPrice, discount, customer) {
  const criteria = discount.eligibility_criteria;

  if (criteria && criteria.startsWith("minPrice:")) {
    const minPrice = parseFloat(criteria.split(":")[1]);
    if (totalPrice < minPrice) return false;
  }

  if (criteria === "VIP" && !customer.isVIP) {
    return false;
  }

  return true;
}

function applyDiscount(totalPrice, discount) {
  if (discount.discount_type === "Percentage") {
    return totalPrice - (totalPrice * (discount.value / 100));
  } else if (discount.discount_type === "Fixed") {
    return totalPrice - discount.value;
  } else {
    return totalPrice;
  }
}

function calculateBestDiscount(totalPrice, discounts, customer) {
  let bestPrice = totalPrice;
  let bestDiscount = null;

  discounts.forEach(discount => {
    if (isDiscountActive(discount) && isEligible(totalPrice, discount, customer)) {
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

module.exports = { isDiscountActive, isEligible, applyDiscount, calculateBestDiscount };
