const { createProduct } = require('../models/productModel');


const addProduct = async (req, res) => {
  const { name, description, price, stock_quantity, category } = req.body;

  // Basic validation for required fields
  if (!name || !description || !price || !stock_quantity || !category) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newProduct = await createProduct(name, description, price, stock_quantity, category);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products 
const { getAllProducts } = require('../models/productModel');


const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update
const { updateProduct } = require('../models/productModel');  // Import updateProduct function

const updateProductDetails = async (req, res) => {
  const { product_id, name, description, price, stock_quantity, category } = req.body;

  // Validate input data
  if (!product_id || !name || !description || !price || !stock_quantity || !category) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedProduct = await updateProduct(product_id, name, description, price, stock_quantity, category);
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a product from the database
const { deleteProduct } = require('../models/productModel');  // Import deleteProduct function


const deleteProductDetails = async (req, res) => {
  const { id } = req.params;  // Get the product_id from the URL parameters

  try {
    const deletedProduct = await deleteProduct(id);
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports = { addProduct, getProducts,updateProductDetails,deleteProductDetails };
