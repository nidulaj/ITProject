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

module.exports = { createProduct, getAllProducts };
