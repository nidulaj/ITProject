const express = require('express');
const router = express.Router()
const { addProduct, getProducts,updateProductDetails } = require('../controllers/productController');

// Route to create a product
router.post('/', addProduct);

// Route to get all products (optional)
router.get('/', getProducts);

// Route to update a product
router.put('/:id', updateProductDetails);

module.exports = router;
