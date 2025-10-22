/*const { pool } = require('../db/dbConnect');

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
*/

////////////////////////////////////////////////////

/*
const { pool } = require('../db/dbConnect');

// -------------------- Create ingredient --------------------
const createIngredient = async (name, quantity, expiry_date, storage_zone_id) => {
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
      'INSERT INTO ingredients (name, quantity, expiry_date, storage_zone_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, expiry_date, storage_zone_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity = used_capacity + $1 WHERE storage_zone_id=$2',
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating ingredient:', error.message);
    throw error;
  }
};

// -------------------- Get all ingredients --------------------
const getAllIngredients = async () => {
  try {
    const result = await pool.query('SELECT * FROM ingredients');
    return result.rows;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

// -------------------- Update ingredient --------------------
const updateIngredient = async (ingredient_id, name, quantity, expiry_date, storage_zone_id) => {
  try {
    quantity = Number(quantity);

    // Fetch current ingredient
    const old = await pool.query(
      'SELECT quantity, storage_zone_id FROM ingredients WHERE ingredient_id=$1',
      [ingredient_id]
    );
    if (old.rows.length === 0) throw new Error('Ingredient not found');

    const oldIngredient = old.rows[0];
    oldIngredient.quantity = Number(oldIngredient.quantity);

    // Adjust capacity if moved zones
    if (oldIngredient.storage_zone_id !== storage_zone_id) {
      await pool.query(
        'UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2',
        [oldIngredient.quantity, oldIngredient.storage_zone_id]
      );
    }

    const zone = await pool.query(
      'SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1',
      [storage_zone_id]
    );
    if (zone.rows.length === 0) throw new Error('Storage zone not found');

    const { capacity, used_capacity } = zone.rows[0];

    let newUsedCapacity;
    if (oldIngredient.storage_zone_id === storage_zone_id) {
      newUsedCapacity = used_capacity - oldIngredient.quantity + quantity;
    } else {
      newUsedCapacity = used_capacity + quantity;
    }

    if (newUsedCapacity > capacity) throw new Error('Zone capacity exceeded');

    const result = await pool.query(
      'UPDATE ingredients SET name=$1, quantity=$2, expiry_date=$3, storage_zone_id=$4 WHERE ingredient_id=$5 RETURNING *',
      [name, quantity, expiry_date, storage_zone_id, ingredient_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity=$1 WHERE storage_zone_id=$2',
      [newUsedCapacity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error updating ingredient:', error.message);
    throw error;
  }
};

// -------------------- Delete ingredient --------------------
const deleteIngredient = async (ingredient_id) => {
  try {
    const ing = await pool.query(
      'SELECT quantity, storage_zone_id FROM ingredients WHERE ingredient_id=$1',
      [ingredient_id]
    );
    if (ing.rows.length === 0) throw new Error('Ingredient not found');

    const { quantity, storage_zone_id } = ing.rows[0];

    const result = await pool.query(
      'DELETE FROM ingredients WHERE ingredient_id=$1 RETURNING *',
      [ingredient_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2',
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting ingredient:', error.message);
    throw error;
  }
};

module.exports = {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
};*/




//with icode
const { pool } = require("../db/dbConnect");

// -------------------- Create ingredient --------------------
const createIngredient = async (icode_id, quantity, expiry_date, storage_zone_id) => {
  try {
    quantity = Number(quantity);

    // Check storage zone capacity
    const zone = await pool.query(
      "SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1",
      [storage_zone_id]
    );
    if (zone.rows.length === 0) throw new Error("Storage zone not found");

    const { capacity, used_capacity } = zone.rows[0];
    if (used_capacity + quantity > capacity) throw new Error("Zone capacity exceeded");

    const result = await pool.query(
      "INSERT INTO ingredients (icode_id, quantity, expiry_date, storage_zone_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [icode_id, quantity, expiry_date, storage_zone_id]
    );

    // Update used capacity
    await pool.query(
      "UPDATE storage_zone SET used_capacity = used_capacity + $1 WHERE storage_zone_id=$2",
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating ingredient:", error.message);
    throw error;
  }
};

// -------------------- Get all ingredients --------------------
const getAllIngredients = async () => {
  try {
    const result = await pool.query(
      `SELECT i.ingredient_id, i.quantity, i.expiry_date, i.storage_zone_id, i.created_at,
              ic.ingredient_id AS icode_id, ic.ingredient_code, ic.name AS icode_name
       FROM ingredients i
       JOIN icode ic ON i.icode_id = ic.ingredient_id
       ORDER BY i.ingredient_id ASC`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

// -------------------- Update ingredient --------------------
const updateIngredient = async (ingredient_id, icode_id, quantity, expiry_date, storage_zone_id) => {
  try {
    quantity = Number(quantity);

    // Fetch current ingredient
    const old = await pool.query(
      "SELECT quantity, storage_zone_id FROM ingredients WHERE ingredient_id=$1",
      [ingredient_id]
    );
    if (old.rows.length === 0) throw new Error("Ingredient not found");

    const oldIngredient = old.rows[0];
    oldIngredient.quantity = Number(oldIngredient.quantity);

    // Adjust capacity if moved zones
    if (oldIngredient.storage_zone_id !== storage_zone_id) {
      await pool.query(
        "UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2",
        [oldIngredient.quantity, oldIngredient.storage_zone_id]
      );
    }

    const zone = await pool.query(
      "SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1",
      [storage_zone_id]
    );
    if (zone.rows.length === 0) throw new Error("Storage zone not found");

    const { capacity, used_capacity } = zone.rows[0];

    let newUsedCapacity;
    if (oldIngredient.storage_zone_id === storage_zone_id) {
      newUsedCapacity = used_capacity - oldIngredient.quantity + quantity;
    } else {
      newUsedCapacity = used_capacity + quantity;
    }

    if (newUsedCapacity > capacity) throw new Error("Zone capacity exceeded");

    const result = await pool.query(
      "UPDATE ingredients SET icode_id=$1, quantity=$2, expiry_date=$3, storage_zone_id=$4 WHERE ingredient_id=$5 RETURNING *",
      [icode_id, quantity, expiry_date, storage_zone_id, ingredient_id]
    );

    await pool.query(
      "UPDATE storage_zone SET used_capacity=$1 WHERE storage_zone_id=$2",
      [newUsedCapacity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error updating ingredient:", error.message);
    throw error;
  }
};

// -------------------- Delete ingredient --------------------
const deleteIngredient = async (ingredient_id) => {
  try {
    const ing = await pool.query(
      "SELECT quantity, storage_zone_id FROM ingredients WHERE ingredient_id=$1",
      [ingredient_id]
    );
    if (ing.rows.length === 0) throw new Error("Ingredient not found");

    const { quantity, storage_zone_id } = ing.rows[0];

    const result = await pool.query(
      "DELETE FROM ingredients WHERE ingredient_id=$1 RETURNING *",
      [ingredient_id]
    );

    // Update used capacity
    await pool.query(
      "UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2",
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error deleting ingredient:", error.message);
    throw error;
  }
};

module.exports = {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
};


