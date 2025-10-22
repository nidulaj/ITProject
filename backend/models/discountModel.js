const { pool } = require('../db/dbConnect');  


const createDiscount = async (discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to, discount_code) => {
  try {
    const result = await pool.query(
      `INSERT INTO "Discount" 
        (discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to, discount_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING 
         discount_id, 
         discount_name, 
         discount_type, 
         value, 
         eligibility_criteria, 
         discount_code,
         TO_CHAR(valid_from, 'YYYY-MM-DD') AS valid_from,
         TO_CHAR(valid_to, 'YYYY-MM-DD')   AS valid_to`,
      [
        discount_name,
        discount_type,
        value,
        eligibility_criteria,
        valid_from || null,   
        valid_to   || null,
        discount_code
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating discount:", error.message);
    throw error;
  }
};


const getAllDiscounts = async () => {
  try {
    const result = await pool.query(
      `SELECT 
         discount_id, 
         discount_name, 
         discount_type, 
         value, 
         eligibility_criteria, 
         discount_code,
         TO_CHAR(valid_from, 'YYYY-MM-DD') AS valid_from,
         TO_CHAR(valid_to, 'YYYY-MM-DD')   AS valid_to
       FROM "Discount"
       ORDER BY discount_id`  
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching discounts:", error.message);
    throw error;
  }
};


const updateDiscount = async (discount_id, discount_name, discount_type, value, eligibility_criteria, valid_from, valid_to) => {
  try {
    const result = await pool.query(
      `UPDATE "Discount" 
         SET discount_name = $1, 
             discount_type = $2, 
             value = $3, 
             eligibility_criteria = $4, 
             valid_from = $5, 
             valid_to = $6
       WHERE discount_id = $7
       RETURNING 
         discount_id, 
         discount_name, 
         discount_type, 
         value, 
         eligibility_criteria, 
         TO_CHAR(valid_from, 'YYYY-MM-DD') AS valid_from,
         TO_CHAR(valid_to, 'YYYY-MM-DD')   AS valid_to`,
      [
        discount_name,
        discount_type,
        value,
        eligibility_criteria,
        valid_from || null,   
        valid_to   || null,
        discount_id
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating discount:", error.message);
    throw error;
  }
};


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


const getDiscountByCode = async (discount_code) => {
  try {
    const result = await pool.query(
      `SELECT 
         discount_id, 
         discount_name, 
         discount_type, 
         value, 
         eligibility_criteria, 
         discount_code,
         TO_CHAR(valid_from, 'YYYY-MM-DD') AS valid_from,
         TO_CHAR(valid_to, 'YYYY-MM-DD')   AS valid_to
       FROM "Discount"
       WHERE discount_code = $1`,
      [discount_code]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching discount by code:", error.message);
    throw error;
  }
};

module.exports = { createDiscount, getAllDiscounts, updateDiscount, deleteDiscount, getDiscountByCode };







