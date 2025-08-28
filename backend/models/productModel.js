const { pool } = require('../db/dbConnect');  // Importing the pool from dbConnect

// Create a new product in the database
const createProduct = async (name, description, price, stock_quantity, category, image) => {
  try {
    let query, values;
    
    if (image && image.buffer) {
      // If image is provided, include it in the query
      query = 'INSERT INTO products ("product_name", "product_description", "price", "stock_quantity", "category", "product_image") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      values = [name, description, price, stock_quantity, category, image.buffer];
    } else {
      // If no image, insert without image
      query = 'INSERT INTO products ("product_name", "product_description", "price", "stock_quantity", "category") VALUES ($1, $2, $3, $4, $5) RETURNING *';
      values = [name, description, price, stock_quantity, category];
    }
    
    const result = await pool.query(query, values);
    return result.rows[0];  // Return the inserted product (including product_id)
  } catch (error) {
    console.error('Error creating product:', error.message);
    console.error(error.stack);
    throw error;
  }
};


// Get all products (optional, but useful for viewing products)
const getAllProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM products');
    // Convert image buffer to base64 for frontend
    const products = result.rows.map(product => {
      if (product.product_image) {
        product.image = product.product_image.toString('base64');
        delete product.product_image; // Remove the original buffer field
      }
      return product;
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};



// Update a product in the database
const updateProduct = async (product_id, name, description, price, stock_quantity, category, image) => {
  try {
    let query, values;
    
    if (image && image.buffer) {
      // If image is provided, include it in the update
      query = 'UPDATE products SET product_name = $1, product_description = $2, price = $3, stock_quantity = $4, category = $5, product_image = $6 WHERE product_id = $7 RETURNING *';
      values = [name, description, price, stock_quantity, category, image.buffer, product_id];
    } else {
      // If no image, update without changing image
      query = 'UPDATE products SET product_name = $1, product_description = $2, price = $3, stock_quantity = $4, category = $5 WHERE product_id = $6 RETURNING *';
      values = [name, description, price, stock_quantity, category, product_id];
    }
    
    const result = await pool.query(query, values);
    
    // Convert image buffer to base64 for frontend response
    const updatedProduct = result.rows[0];
    if (updatedProduct.product_image) {
      updatedProduct.image = updatedProduct.product_image.toString('base64');
      delete updatedProduct.product_image;
    }
    
    return updatedProduct;
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
