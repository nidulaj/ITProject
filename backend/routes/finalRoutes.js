const express = require('express');
const router = express.Router();
const { addFinalProduct,getFinalProduct ,updateFinalDetails,deleteFinalProductDetails} = require('../controllers/finalController');
// POST /api/ingredient → Create a new ingredient
router.post('/', addFinalProduct);

// GET /api/ingredient → Fetch all ingredients
router.get('/', getFinalProduct);

// Route to update a product
router.put('/:id', updateFinalDetails);

// Route to delete a product
router.delete('/:id', deleteFinalProductDetails);
module.exports = router;