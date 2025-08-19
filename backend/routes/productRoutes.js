const express = require('express');
const router = express.Router()
const { addProduct, getProducts } = require('../controllers/productController');

// Route to create a product
router.post('/', addProduct);

// Route to get all products (optional)
router.get('/', getProducts);

module.exports = router;
