// const { pool } = require('../db/dbConnect');

// // Create a new ingredient in the database
// const createFinalProduct= async (pname, batch_no, quantity,expiry_date) => {
//   try {
//     const result = await pool.query(
//       'INSERT INTO final_products (pname, batch_no, quantity,expiry_date) VALUES ($1, $2, $3, $4) RETURNING *',
//       [pname, batch_no, quantity,expiry_date]
//     );
//     return result.rows[0];
//   } catch (error) {
//     console.error('Error creating finalproduct:', error.message);
//     throw error;
//   }
// };

 
// const getAllFinalProducts = async () => {
//   try {
//     const result = await pool.query('SELECT * FROM final_products');
//     return result.rows;
//   } catch (error) {
//     console.error('Error fetching final products:', error);
//     throw error;
//   }
// };
 
// // Update a product in the database
// const updateFinalProduct = async (fproduct_id, pname, batch_no, quantity,expiry_date) => {
//   try {
//     const result = await pool.query(
//       'UPDATE final_products SET pname = $2, batch_no = $3, quantity = $4, expiry_date = $5  WHERE fproduct_id = $1 RETURNING *',
//       [fproduct_id, pname, batch_no, quantity,expiry_date]  // Include the product_id for which the product will be updated
//     );
//     return result.rows[0];  // Return the updated product
//   } catch (error) {
//     console.error('Error updating product:', error.message);
//     console.error(error.stack);
//     throw error;
//   }
// };

 


 



// // Delete a product from the database
// const deleteFinalProduct= async (fproduct_id) => {
//   try {
//     const result = await pool.query(
//       'DELETE FROM final_products WHERE fproduct_id = $1 RETURNING *',
//       [fproduct_id]  // Use the ingredient_id to delete the correct ingredient
//     );

//     if (result.rows.length === 0) {
//       throw new Error('Ingredient not found');  // If no ingredient was deleted
//     }

//     return result.rows[0];  // Return the deleted ingredient (optional)
//   } catch (error) {
//     console.error('Error deleting final product:', error.message);
//     throw error;  // Rethrow the error to handle it in the controller
//   }
// };





// module.exports = { createFinalProduct ,getAllFinalProducts,updateFinalProduct,deleteFinalProduct};


/////////////////////////////

const { pool } = require('../db/dbConnect');

// -------------------- Create final product --------------------
const createFinalProduct = async (pname, batch_no, quantity, expiry_date, storage_zone_id) => {
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
      'INSERT INTO final_products (pname, batch_no, quantity, expiry_date, storage_zone_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pname, batch_no, quantity, expiry_date, storage_zone_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity = used_capacity + $1 WHERE storage_zone_id=$2',
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating final product:', error.message);
    throw error;
  }
};

// -------------------- Get all final products --------------------
const getAllFinalProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM final_products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching final products:', error);
    throw error;
  }
};

// -------------------- Update final product --------------------
const updateFinalProduct = async (fproduct_id, pname, batch_no, quantity, expiry_date, storage_zone_id) => {
  try {
    quantity = Number(quantity);

    // 1️⃣ Fetch old product
    const old = await pool.query(
      'SELECT quantity, storage_zone_id FROM final_products WHERE fproduct_id=$1',
      [fproduct_id]
    );
    if (old.rows.length === 0) throw new Error('Final product not found');

    const oldProduct = old.rows[0];
    oldProduct.quantity = Number(oldProduct.quantity);

    // 2️⃣ If zone changed, free capacity in old zone
    if (oldProduct.storage_zone_id !== storage_zone_id) {
      await pool.query(
        'UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2',
        [oldProduct.quantity, oldProduct.storage_zone_id]
      );
    }

    // 3️⃣ Check target zone capacity
    const zone = await pool.query(
      'SELECT capacity, used_capacity FROM storage_zone WHERE storage_zone_id=$1',
      [storage_zone_id]
    );
    if (zone.rows.length === 0) throw new Error('Storage zone not found');

    const { capacity, used_capacity } = zone.rows[0];

    // ✅ Calculate new used capacity
    let newUsedCapacity;
    if (oldProduct.storage_zone_id === storage_zone_id) {
      // same zone: subtract old qty and add new
      newUsedCapacity = used_capacity - oldProduct.quantity + quantity;
    } else {
      // different zone: add new qty (old zone already freed)
      newUsedCapacity = used_capacity + quantity;
    }

    if (newUsedCapacity > capacity) throw new Error('Zone capacity exceeded');

    // 4️⃣ Update the product
    const result = await pool.query(
      `UPDATE final_products
       SET pname=$1, batch_no=$2, quantity=$3, expiry_date=$4, storage_zone_id=$5
       WHERE fproduct_id=$6
       RETURNING *`,
      [pname, batch_no, quantity, expiry_date, storage_zone_id, fproduct_id]
    );

    // 5️⃣ Update target zone capacity to the new value
    await pool.query(
      'UPDATE storage_zone SET used_capacity=$1 WHERE storage_zone_id=$2',
      [newUsedCapacity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error updating final product:', error.message);
    throw error;
  }
};

// -------------------- Delete final product --------------------
const deleteFinalProduct = async (fproduct_id) => {
  try {
    const prod = await pool.query(
      'SELECT quantity, storage_zone_id FROM final_products WHERE fproduct_id=$1',
      [fproduct_id]
    );
    if (prod.rows.length === 0) throw new Error('Final product not found');

    const { quantity, storage_zone_id } = prod.rows[0];

    const result = await pool.query(
      'DELETE FROM final_products WHERE fproduct_id=$1 RETURNING *',
      [fproduct_id]
    );

    await pool.query(
      'UPDATE storage_zone SET used_capacity = used_capacity - $1 WHERE storage_zone_id=$2',
      [quantity, storage_zone_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting final product:', error.message);
    throw error;
  }
};

module.exports = {
  createFinalProduct,
  getAllFinalProducts,
  updateFinalProduct,
  deleteFinalProduct
};

