const { pool } = require('../db/dbConnect');  // Importing the pool from dbConnect

// Create a new product in the database
const createProduct = async (name, description, price, stock_quantity, category) => {
  try {
    const result = await pool.query(
      'INSERT INTO products ("product_name", "product_description", "price", "stock_quantity", "category") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock_quantity, category]  // Include category here
    );
    return result.rows[0];  // Return the inserted product (including product_id)
  } catch (error) {
    console.error('Error creating product:', error.message);  // Log the error message
    console.error(error.stack);  // Log the stack trace for more details
    throw error;  // Rethrow the error to handle it in the controller
  }
};


// Get all products (optional, but useful for viewing products)
const getAllProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};



// Update a product in the database
const updateProduct = async (product_id, name, description, price, stock_quantity, category) => {
  try {
    const result = await pool.query(
      'UPDATE products SET product_name = $1, product_description = $2, price = $3, stock_quantity = $4, category = $5 WHERE product_id = $6 RETURNING *',
      [name, description, price, stock_quantity, category, product_id]  // Include the product_id for which the product will be updated
    );
    return result.rows[0];  // Return the updated product
  } catch (error) {
    console.error('Error updating product:', error.message);
    console.error(error.stack);
    throw error;
  }
};



// Delete a product from the database
const deleteProduct = async (product_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE product_id = $1 RETURNING *',
      [product_id]  // Use the product_id to delete the correct product
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');  // If no product was deleted
    }

    return result.rows[0];  // Return the deleted product (optional)
  } catch (error) {
    console.error('Error deleting product:', error.message);
    throw error;  // Rethrow the error to handle it in the controller
  }
};





module.exports = { createProduct, getAllProducts,updateProduct,deleteProduct };
