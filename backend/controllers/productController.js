const { createProduct } = require('../models/productModel');


const addProduct = async (req, res) => {
  console.log('Add Product Request received:');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  const { name, description, price, stock_quantity, category } = req.body;
  const image = req.file; // Get uploaded file from multer

  // Basic validation for required fields
  if (!name || !description || !price || !stock_quantity || !category) {
    console.log('Validation failed - missing fields:');
    console.log('name:', name, 'description:', description, 'price:', price, 'stock_quantity:', stock_quantity, 'category:', category);
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    console.log('Attempting to create product with:', { name, description, price, stock_quantity, category, hasImage: !!image });
    const newProduct = await createProduct(name, description, price, stock_quantity, category, image);
    console.log('Product created successfully:', newProduct);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get all products 
const { getAllProducts } = require('../models/productModel');


const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    console.log('Raw products from database:', products);
    console.log('First product structure:', products[0]);
    if (products[0]) {
      console.log('First product name field:', products[0].name);
      console.log('First product description field:', products[0].description);
      console.log('First product product_name field:', products[0].product_name);
      console.log('First product product_description field:', products[0].product_description);
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update
const { updateProduct } = require('../models/productModel');  // Import updateProduct function

const updateProductDetails = async (req, res) => {
  const { id } = req.params; // Get product_id from URL parameters
  const { name, description, price, stock_quantity, category } = req.body;
  const image = req.file; // Get uploaded file from multer

  console.log('Update Product Request received:');
  console.log('Product ID:', id);
  console.log('Body:', req.body);
  console.log('File:', req.file);

  // Validate input data
  if (!id || !name || !description || !price || !stock_quantity || !category) {
    console.log('Validation failed - missing fields:');
    console.log('id:', id, 'name:', name, 'description:', description, 'price:', price, 'stock_quantity:', stock_quantity, 'category:', category);
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    console.log('Attempting to update product with ID:', id);
    const updatedProduct = await updateProduct(id, name, description, price, stock_quantity, category, image);
    console.log('Product updated successfully:', updatedProduct);
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Delete a product from the database
const { deleteProduct } = require('../models/productModel');  // Import deleteProduct function


const deleteProductDetails = async (req, res) => {
  const { id } = req.params;  // Get the product_id from the URL parameters

  console.log('Delete Product Request received:');
  console.log('Product ID:', id);

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }

  try {
    console.log('Attempting to delete product with ID:', id);
    const deletedProduct = await deleteProduct(id);
    console.log('Product deleted successfully:', deletedProduct);
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    console.error('Error stack:', error.stack);
    
    if (error.message === 'Product not found') {
      res.status(404).json({ error: 'Product not found', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
};





module.exports = { addProduct, getProducts,updateProductDetails,deleteProductDetails };


