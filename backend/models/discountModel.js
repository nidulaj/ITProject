const { pool } = require('../db/dbConnect');  // Import DB connection

// Create a new discount
const createDiscount = async (discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to) => {
  try {
    const result = await pool.query(
      `INSERT INTO "Discount" 
      (discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to]
    );
    return result.rows[0];  // return the inserted discount
  } catch (error) {
    console.error("Error creating discount:", error.message);
    throw error;
  }
};

// Get all discounts
const getAllDiscounts = async () => {
  try {
    const result = await pool.query('SELECT * FROM "Discount"');
    return result.rows;
  } catch (error) {
    console.error("Error fetching discounts:", error.message);
    throw error;
  }
};

// Update a discount
const updateDiscount = async (discount_id, discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to) => {
  try {
    const result = await pool.query(
      `UPDATE "Discount" 
       SET discount_name = $1, discount_type = $2, value = $3, eligibility_criteria = $4, valid_from = $5, valid_to = $6
       WHERE discount_id = $7
       RETURNING *`,
      [discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to, discount_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating discount:", error.message);
    throw error;
  }
};

// Delete a discount
const deleteDiscount = async (discount_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM "Discount" WHERE discount_id = $1 RETURNING *`,
      [discount_id]
    );

    if (result.rows.length === 0) {
      throw new Error("Discount not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error deleting discount:", error.message);
    throw error;
  }
};

module.exports = { createDiscount, getAllDiscounts, updateDiscount, deleteDiscount };
