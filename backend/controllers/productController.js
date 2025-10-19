const { createProduct } = require('../models/productModel');


const addProduct = async (req, res) => {
  console.log('🛍️ Add Product Request received:');
  console.log('📦 Body:', req.body);
  console.log('📁 File:', req.file);
  console.log('🔍 Body keys:', Object.keys(req.body));
  console.log('🔍 Body values:', Object.values(req.body));
  
  const { name, description, price, category, final_product_id } = req.body;
  const image = req.file; // Get uploaded file from multer

  console.log('🔍 Extracted values:');
  console.log('  name:', name, 'type:', typeof name);
  console.log('  description:', description, 'type:', typeof description);
  console.log('  price:', price, 'type:', typeof price);
  console.log('  category:', category, 'type:', typeof category);
  console.log('  final_product_id:', final_product_id, 'type:', typeof final_product_id);

  // Basic validation for required fields
  if (!name || !description || !price || !category || !final_product_id) {
    console.log('❌ Validation failed - missing fields:');
    console.log('  name:', name, 'exists:', !!name);
    console.log('  description:', description, 'exists:', !!description);
    console.log('  price:', price, 'exists:', !!price);
    console.log('  category:', category, 'exists:', !!category);
    console.log('  final_product_id:', final_product_id, 'exists:', !!final_product_id);
    return res.status(400).json({ error: 'All fields are required including final_product_id.' });
  }

  try {
    console.log('Attempting to create product with:', { name, description, price, category, final_product_id, hasImage: !!image });
    const newProduct = await createProduct(name, description, price, category, image, final_product_id);
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
  const { name, description, price, category, final_product_id } = req.body;
  const image = req.file; // Get uploaded file from multer

  console.log('Update Product Request received:');
  console.log('Product ID:', id);
  console.log('Body:', req.body);
  console.log('File:', req.file);

  // Validate input data
  if (!id || !name || !description || !price || !category || !final_product_id) {
    console.log('Validation failed - missing fields:');
    console.log('id:', id, 'name:', name, 'description:', description, 'price:', price, 'category:', category, 'final_product_id:', final_product_id);
    return res.status(400).json({ error: 'All fields are required including final_product_id.' });
  }

  try {
    console.log('Attempting to update product with ID:', id);
    const updatedProduct = await updateProduct(id, name, description, price, category, image, final_product_id);
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




