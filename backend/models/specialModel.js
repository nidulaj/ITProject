// const { pool } = require('../db/dbConnect');

// // Create a new special ingredient in the database
// const createSpecialIngredient = async (name, quantity, expiry_date, storage_zone_id) => {
//   try {
//     const result = await pool.query(
//       'INSERT INTO special_ingredient (name, quantity, expiry_date, storage_zone_id) VALUES ($1, $2, $3, $4) RETURNING *',
//       [name, quantity, expiry_date, storage_zone_id]
//     );
//     return result.rows[0];
//   } catch (error) {
//     console.error('Error creating ingredient:', error.message);
//     throw error;
//   }
// };

// // Get all ingredients (optional, but useful for viewing products)
// const getAllSpecialIngredients = async () => {
//   try {
//     const result = await pool.query('SELECT * FROM special_ingredient');
//     return result.rows;
//   } catch (error) {
//     console.error('Error fetching ingredients:', error);
//     throw error;
//   }
// };
 
// // Update a product in the database
// const updateSpecialIngredient = async (special_id, name, quantity, expiry_date, storage_zone_id) => {
//   try {
//     const result = await pool.query(
//       'UPDATE special_ingredient SET name = $2, quantity = $3, expiry_date = $4, storage_zone_id = $5  WHERE special_id = $1 RETURNING *',
//       [special_id, name, quantity, expiry_date, storage_zone_id]  // Include the product_id for which the product will be updated
//     );
//     return result.rows[0];  // Return the updated product
//   } catch (error) {
//     console.error('Error updating ingredient:', error.message);
//     console.error(error.stack);
//     throw error;
//   }
// };

 


 



// // Delete a product from the database
// const deleteSpecialIngredient = async (special_id) => {
//   try {
//     const result = await pool.query(
//       'DELETE FROM special_ingredient WHERE special_id = $1 RETURNING *',
//       [special_id]  // Use the ingredient_id to delete the correct ingredient
//     );

//     if (result.rows.length === 0) {
//       throw new Error('Ingredient not found');  // If no ingredient was deleted
//     }

//     return result.rows[0];  // Return the deleted ingredient (optional)
//   } catch (error) {
//     console.error('Error deleting ingredient:', error.message);
//     throw error;  // Rethrow the error to handle it in the controller
//   }
// };





// module.exports = { createSpecialIngredient ,getAllSpecialIngredients,updateSpecialIngredient,deleteSpecialIngredient};

//////////////////////////////////////////
const { pool } = require('../db/dbConnect');

// Create special ingredient
const createSpecialIngredient = async (name, quantity, expiry_date, storage_zone_id) => {
  try {
    quantity = Number(quantity);

    const zone = await pool.query(
      'SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1',
      [storage_zone_id]
    );
    if (zone.rows.length === 0) throw new Error('Storage zone not found');
    const { capacity, used_capacity } = zone.rows[0];

    if (used_capacity + quantity > capacity) throw new Error('Zone capacity exceeded');

    const result = await pool.query(
      'INSERT INTO special_ingredient (name, quantity, expiry_date, storage_zone_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, expiry_date, storage_zone_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity = used_capacity + $1 WHERE storage_zone_id=$2',
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating special ingredient:', error.message);
    throw error;
  }
};

// Get all special ingredients
const getAllSpecialIngredients = async () => {
  try {
    const result = await pool.query('SELECT * FROM special_ingredient');
    return result.rows;
  } catch (error) {
    console.error('Error fetching special ingredients:', error);
    throw error;
  }
};

// Update special ingredient
const updateSpecialIngredient = async (special_id, name, quantity, expiry_date, storage_zone_id) => {
  try {
    quantity = Number(quantity);

    // Get old ingredient details
    const old = await pool.query(
      'SELECT quantity, storage_zone_id FROM special_ingredient WHERE special_id=$1',
      [special_id]
    );
    if (old.rows.length === 0) throw new Error('Special ingredient not found');
    const oldIngredient = old.rows[0];
    oldIngredient.quantity = Number(oldIngredient.quantity);

    // If storage zone is the same, adjust capacity in one step
    if (oldIngredient.storage_zone_id === storage_zone_id) {
      const zone = await pool.query(
        'SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1',
        [storage_zone_id]
      );
      if (zone.rows.length === 0) throw new Error('Storage zone not found');
      const { capacity, used_capacity } = zone.rows[0];

      const newUsedCapacity = used_capacity - oldIngredient.quantity + quantity;
      if (newUsedCapacity > capacity) throw new Error('Zone capacity exceeded');

      await pool.query(
        'UPDATE storage_zone SET used_capacity = $1 WHERE storage_zone_id=$2',
        [newUsedCapacity, storage_zone_id]
      );
    } else {
      // Moving to a different zone
      // 1. Free old zone space
      await pool.query(
        'UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2',
        [oldIngredient.quantity, oldIngredient.storage_zone_id]
      );

      // 2. Check and update new zone
      const zone = await pool.query(
        'SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1',
        [storage_zone_id]
      );
      if (zone.rows.length === 0) throw new Error('New storage zone not found');
      const { capacity, used_capacity } = zone.rows[0];

      if (used_capacity + quantity > capacity) throw new Error('Zone capacity exceeded');

      await pool.query(
        'UPDATE storage_zone SET used_capacity = used_capacity + $1 WHERE storage_zone_id=$2',
        [quantity, storage_zone_id]
      );
    }

    const result = await pool.query(
      'UPDATE special_ingredient SET name=$1, quantity=$2, expiry_date=$3, storage_zone_id=$4 WHERE special_id=$5 RETURNING *',
      [name, quantity, expiry_date, storage_zone_id, special_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error updating special ingredient:', error.message);
    throw error;
  }
};

// Delete special ingredient
const deleteSpecialIngredient = async (special_id) => {
  try {
    const ing = await pool.query(
      'SELECT quantity, storage_zone_id FROM special_ingredient WHERE special_id=$1',
      [special_id]
    );
    if (ing.rows.length === 0) throw new Error('Special ingredient not found');
    const { quantity, storage_zone_id } = ing.rows[0];

    const result = await pool.query(
      'DELETE FROM special_ingredient WHERE special_id=$1 RETURNING *',
      [special_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2',
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting special ingredient:', error.message);
    throw error;
  }
};

module.exports = {
  createSpecialIngredient,
  getAllSpecialIngredients,
  updateSpecialIngredient,
  deleteSpecialIngredient,
};

