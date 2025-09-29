const {
  calculateTotalsByIcode,
  getAllIngredientTotals,
  updateTotalForIcode,
} = require("../models/ingredientTotalsModel");

// -------------------- Calculate and update all totals --------------------
const calculateTotals = async (req, res) => {
  try {
    const totals = await calculateTotalsByIcode();
    res.status(200).json({
      message: "Totals calculated successfully",
      totals: totals,
    });
  } catch (error) {
    console.error("Error calculating totals:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -------------------- Get all ingredient totals --------------------
const getIngredientTotals = async (req, res) => {
  try {
    const totals = await getAllIngredientTotals();
    res.status(200).json({ totals });
  } catch (error) {
    console.error("Error fetching ingredient totals:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  calculateTotals,
  getIngredientTotals,
};