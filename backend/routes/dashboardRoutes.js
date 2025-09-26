const express = require("express");
const router = express.Router();
const { pool } = require("../db/dbConnect"); // ✅ destructure pool

// GET /api/dashboard/summary
router.get("/summary", async (req, res) => {
  try {
    const ingredients = await pool.query("SELECT COUNT(*) AS count FROM ingredients");
    const specialIngredients = await pool.query("SELECT COUNT(*) AS count FROM special_ingredient");
    const finalProducts = await pool.query("SELECT COUNT(*) AS count FROM final_products");
    const zones = await pool.query("SELECT COUNT(*) AS count FROM storage_zone");

    res.json({
      ingredients: ingredients.rows[0].count,
      specialIngredients: specialIngredients.rows[0].count,
      finalProducts: finalProducts.rows[0].count,
      availableSpaces: zones.rows[0].count,
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
