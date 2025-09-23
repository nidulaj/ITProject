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
    
    // Map database field names to frontend expected field names
    const newProduct = {
      product_id: result.rows[0].product_id,
      name: result.rows[0].product_name,  // Map product_name to name
      description: result.rows[0].product_description,  // Map product_description to description
      price: result.rows[0].price,
      stock_quantity: result.rows[0].stock_quantity,
      category: result.rows[0].category,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at
    };
    
    // Convert image buffer to base64 for frontend response
    if (result.rows[0].product_image) {
      newProduct.image = result.rows[0].product_image.toString('base64');
    }
    
    return newProduct;
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
    console.log('Raw database result:', result.rows[0]);
    if (result.rows[0]) {
      console.log('Database columns:', Object.keys(result.rows[0]));
    }
    // Convert field names and image buffer to match frontend expectations
    const products = result.rows.map(product => {
      console.log('Processing product:', product);
      const mappedProduct = {
        product_id: product.product_id,
        name: product.product_name,  // Map product_name to name
        description: product.product_description,  // Map product_description to description
        price: product.price,
        stock_quantity: product.stock_quantity,
        category: product.category,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
      
      console.log('Mapped product:', mappedProduct);
      
      // Convert image buffer to base64 for frontend
      if (product.product_image) {
        mappedProduct.image = product.product_image.toString('base64');
      }
      
      return mappedProduct;
    });
    console.log('Final products array:', products);
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
    
    // Map database field names to frontend expected field names
    const updatedProduct = {
      product_id: result.rows[0].product_id,
      name: result.rows[0].product_name,  // Map product_name to name
      description: result.rows[0].product_description,  // Map product_description to description
      price: result.rows[0].price,
      stock_quantity: result.rows[0].stock_quantity,
      category: result.rows[0].category,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at
    };
    
    // Convert image buffer to base64 for frontend response
    if (result.rows[0].product_image) {
      updatedProduct.image = result.rows[0].product_image.toString('base64');
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
