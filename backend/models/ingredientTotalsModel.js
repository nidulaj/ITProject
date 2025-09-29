const { pool } = require("../db/dbConnect");

// -------------------- Calculate totals by icode from ingredients table --------------------
const calculateTotalsByIcode = async () => {
  try {
    // Use the database function to recalculate all totals
    await pool.query("SELECT recalculate_all_ingredient_totals()");
    
    // Get the updated totals
    const result = await pool.query(`
      SELECT icode_id, total_quantity
      FROM ingredient_totals
      ORDER BY icode_id
    `);

    return result.rows;
  } catch (error) {
    console.error("Error calculating totals by icode:", error);
    throw error;
  }
};

// -------------------- Get all ingredient totals --------------------
const getAllIngredientTotals = async () => {
  try {
    const result = await pool.query(`
      SELECT it.total_id, it.icode_id, it.total_quantity, it.last_updated,
             ic.ingredient_code, ic.name as icode_name
      FROM ingredient_totals it
      JOIN icode ic ON it.icode_id = ic.ingredient_id
      ORDER BY it.icode_id ASC
    `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching ingredient totals:", error);
    throw error;
  }
};

// -------------------- Update total for specific icode --------------------
const updateTotalForIcode = async (icode_id) => {
  try {
    // Calculate total quantity for this icode from ingredients table
    const result = await pool.query(`
      SELECT SUM(quantity) as total_quantity
      FROM ingredients 
      WHERE icode_id = $1
    `, [icode_id]);
    
    const total_quantity = result.rows[0].total_quantity || 0;
    
    // Update or insert the total
    const updateResult = await pool.query(`
      INSERT INTO ingredient_totals (icode_id, total_quantity, last_updated)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (icode_id) 
      DO UPDATE SET 
        total_quantity = EXCLUDED.total_quantity,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `, [icode_id, total_quantity]);
    
    return updateResult.rows[0];
  } catch (error) {
    console.error("Error updating total for icode:", error);
    throw error;
  }
};

module.exports = {
  calculateTotalsByIcode,
  getAllIngredientTotals,
  updateTotalForIcode,
};