const { createProduct, getAllProducts } = require('../models/productModel');

// Create a new product
const addProduct = async (req, res) => {
  const { name, description, price, stock_quantity } = req.body;

  // Validate input data (Basic validation, you can expand it)
  if (!name || !description || !price || !stock_quantity) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newProduct = await createProduct(name, description, price, stock_quantity);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products (Optional)
const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addProduct, getProducts };
