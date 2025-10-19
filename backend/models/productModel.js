const { pool } = require('../db/dbConnect');  // Importing the pool from dbConnect

// Create a new product in the database
//a
const createProduct = async (name, description, price, category, image, final_product_id) => {
  try {
    let query, values;
    
    if (image && image.buffer) {
      // If image is provided, include it in the query
      query = 'INSERT INTO products ("product_name", "product_description", "price", "category", "product_image", "final_product_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      values = [name, description, price, category, image.buffer, final_product_id];
    } else {
      // If no image, insert without image
      query = 'INSERT INTO products ("product_name", "product_description", "price", "category", "final_product_id") VALUES ($1, $2, $3, $4, $5) RETURNING *';
      values = [name, description, price, category, final_product_id];
    }
    
    const result = await pool.query(query, values);
    
    // Map database field names to frontend expected field names
    const newProduct = {
      product_id: result.rows[0].product_id,
      name: result.rows[0].product_name,  // Map product_name to name
      description: result.rows[0].product_description,  // Map product_description to description
      price: result.rows[0].price,
      category: result.rows[0].category,
      final_product_id: result.rows[0].final_product_id,
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
    const result = await pool.query(`
      SELECT 
        p.product_id, 
        p.product_name, 
        p.product_description, 
        p.price, 
        p.category, 
        p.final_product_id, 
        p.product_image, 
        p.created_at, 
        p.updated_at,
        COALESCE(fp.quantity, 0) as stock_quantity
      FROM products p
      LEFT JOIN final_products fp ON p.final_product_id = fp.fproduct_id
      ORDER BY p.product_id
    `);
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
        category: product.category,
        final_product_id: product.final_product_id,
        stock_quantity: product.stock_quantity, // From joined final_products table
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
const updateProduct = async (product_id, name, description, price, category, image, final_product_id) => {
  try {
    let query, values;
    
    if (image && image.buffer) {
      // If image is provided, include it in the update
      query = 'UPDATE products SET product_name = $1, product_description = $2, price = $3, category = $4, product_image = $5, final_product_id = $6 WHERE product_id = $7 RETURNING *';
      values = [name, description, price, category, image.buffer, final_product_id, product_id];
    } else {
      // If no image, update without changing image
      query = 'UPDATE products SET product_name = $1, product_description = $2, price = $3, category = $4, final_product_id = $5 WHERE product_id = $6 RETURNING *';
      values = [name, description, price, category, final_product_id, product_id];
    }
    
    const result = await pool.query(query, values);
    
    // Map database field names to frontend expected field names
    const updatedProduct = {
      product_id: result.rows[0].product_id,
      name: result.rows[0].product_name,  // Map product_name to name
      description: result.rows[0].product_description,  // Map product_description to description
      price: result.rows[0].price,
      category: result.rows[0].category,
      final_product_id: result.rows[0].final_product_id,
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
