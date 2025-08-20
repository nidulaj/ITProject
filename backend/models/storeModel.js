const { pool } = require('../db/dbConnect');

// Create a new ingredient in the database
const createZone= async (zone_name, capacity, used_capacity ) => {
  try {
    const result = await pool.query(
      'INSERT INTO storage_zone (zone_name, capacity, used_capacity) VALUES ($1, $2, $3) RETURNING *',
      [zone_name, capacity, used_capacity ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating zone:', error.message);
    throw error;
  }
};

// Get all ingredients (optional, but useful for viewing products)
const getAllZones = async () => {
  try {
    const result = await pool.query('SELECT * FROM storage_zone');
    return result.rows;
  } catch (error) {
    console.error('Error fetching zone:', error);
    throw error;
  }
};
 
// Update a product in the database
const updateZones = async (storage_zone_id, zone_name, capacity, used_capacity) => {
  try {
    const result = await pool.query(
      'UPDATE storage_zone SET zone_name = $2, capacity = $3, used_capacity = $4  WHERE storage_zone_id = $1 RETURNING *',
      [storage_zone_id, zone_name, capacity, used_capacity]  
    );
    return result.rows[0];   
  } catch (error) {
    console.error('Error updating zone:', error.message);
    console.error(error.stack);
    throw error;
  }
};

 


 



// Delete a product from the database
const deleteZone = async (storage_zone_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM storage_zone WHERE storage_zone_id = $1 RETURNING *',
      [storage_zone_id]  // Use the ingredient_id to delete the correct ingredient
    );

    if (result.rows.length === 0) {
      throw new Error('zone not found');  // If no ingredient was deleted
    }

    return result.rows[0];  // Return the deleted ingredient (optional)
  } catch (error) {
    console.error('Error deleting zone:', error.message);
    throw error;  // Rethrow the error to handle it in the controller
  }
};





module.exports = { createZone ,getAllZones,updateZones,deleteZone};