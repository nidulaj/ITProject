const { pool } = require('../db/dbConnect');

// Create a new ingredient in the database
const createIngredient = async (name, quantity, expiry_date, storage_zone_id) => {
  try {
    const result = await pool.query(
      'INSERT INTO ingredients (name, quantity, expiry_date, storage_zone_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, expiry_date, storage_zone_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating ingredient:', error.message);
    throw error;
  }
};

// Get all ingredients (optional, but useful for viewing products)
const getAllIngredients = async () => {
  try {
    const result = await pool.query('SELECT * FROM ingredients');
    return result.rows;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};
 
// Update a product in the database
const updateIngredient = async (ingredient_id, name, quantity, expiry_date, storage_zone_id) => {
  try {
    const result = await pool.query(
      'UPDATE ingredients SET name = $2, quantity = $3, expiry_date = $4, storage_zone_id = $5  WHERE ingredient_id = $1 RETURNING *',
      [ingredient_id, name, quantity, expiry_date, storage_zone_id]  // Include the product_id for which the product will be updated
    );
    return result.rows[0];  // Return the updated product
  } catch (error) {
    console.error('Error updating product:', error.message);
    console.error(error.stack);
    throw error;
  }
};

 


 



// Delete a product from the database
const deleteIngredient = async (ingredient_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *',
      [ingredient_id]  // Use the ingredient_id to delete the correct ingredient
    );

    if (result.rows.length === 0) {
      throw new Error('Ingredient not found');  // If no ingredient was deleted
    }

    return result.rows[0];  // Return the deleted ingredient (optional)
  } catch (error) {
    console.error('Error deleting ingredient:', error.message);
    throw error;  // Rethrow the error to handle it in the controller
  }
};





module.exports = { createIngredient ,getAllIngredients,updateIngredient,deleteIngredient};