const { pool } = require('../db/dbConnect');

// Create a new ingredient in the database
const createFinalProduct= async (pname, batch_no, quantity,expiry_date) => {
  try {
    const result = await pool.query(
      'INSERT INTO final_products (pname, batch_no, quantity,expiry_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [pname, batch_no, quantity,expiry_date]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating finalproduct:', error.message);
    throw error;
  }
};

 
const getAllFinalProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM final_products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching final products:', error);
    throw error;
  }
};
 
// Update a product in the database
const updateFinalProduct = async (fproduct_id, pname, batch_no, quantity,expiry_date) => {
  try {
    const result = await pool.query(
      'UPDATE final_products SET pname = $2, batch_no = $3, quantity = $4, expiry_date = $5  WHERE fproduct_id = $1 RETURNING *',
      [fproduct_id, pname, batch_no, quantity,expiry_date]  // Include the product_id for which the product will be updated
    );
    return result.rows[0];  // Return the updated product
  } catch (error) {
    console.error('Error updating product:', error.message);
    console.error(error.stack);
    throw error;
  }
};

 


 



// Delete a product from the database
const deleteFinalProduct= async (fproduct_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM final_products WHERE fproduct_id = $1 RETURNING *',
      [fproduct_id]  // Use the ingredient_id to delete the correct ingredient
    );

    if (result.rows.length === 0) {
      throw new Error('Ingredient not found');  // If no ingredient was deleted
    }

    return result.rows[0];  // Return the deleted ingredient (optional)
  } catch (error) {
    console.error('Error deleting final product:', error.message);
    throw error;  // Rethrow the error to handle it in the controller
  }
};





module.exports = { createFinalProduct ,getAllFinalProducts,updateFinalProduct,deleteFinalProduct};