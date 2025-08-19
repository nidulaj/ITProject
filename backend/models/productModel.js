const { pool } = require('../db/dbConnect');  // Importing the pool from dbConnect

// Create a new product in the database
const createProduct = async (name, description, price, stock_quantity) => {
  try {
    const result = await pool.query(
      'INSERT INTO products ("product_name", "product_description", "price", "stock_quantity") VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock_quantity]
    );
    return result.rows[0];  // Return the inserted product
  } catch (error) {
    console.error('Error creating product:', error);
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
