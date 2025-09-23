const express = require('express');
const multer = require('multer');
const router = express.Router();
const { addProduct, getProducts, updateProductDetails, deleteProductDetails } = require('../controllers/productController');

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Route to create a product
router.post('/', upload.single('image'), addProduct);

// Route to get all products (optional)
router.get('/', getProducts);

// Route to update a product
router.put('/:id', upload.single('image'), updateProductDetails);

// Route to delete a product
router.delete('/:id', deleteProductDetails);

module.exports = router;
