const {
  calculateTotalsByIcode,
  getAllIngredientTotals,
  updateTotalForIcode,
  reduceIngredientTotal,
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

// -------------------- Reduce ingredient total --------------------
const reduceTotal = async (req, res) => {
  try {
    const { icode_id, quantity } = req.body;
    
    if (!icode_id || !quantity) {
      return res.status(400).json({ 
        error: "icode_id and quantity are required" 
      });
    }
    
    const result = await reduceIngredientTotal(icode_id, quantity);
    
    res.status(200).json({
      message: "Ingredient total reduced successfully",
      updated_total: result,
    });
  } catch (error) {
    console.error("Error reducing ingredient total:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  calculateTotals,
  getIngredientTotals,
  reduceTotal,
};