/*const express = require('express');
const router = express.Router();
const { addSpecialIngredient,getSpecialIngredients ,updateSpecialIngredientDetails,deleteSpecialIngredientDetails} = require('../controllers/specialController');
// POST /api/ingredient → Create a new ingredient
router.post('/', addSpecialIngredient);

// GET /api/ingredient → Fetch all ingredients
router.get('/', getSpecialIngredients);

// Route to update a product
router.put('/:id', updateSpecialIngredientDetails);

// Route to delete a product
router.delete('/:id', deleteSpecialIngredientDetails);




module.exports = router;
*/


const express = require('express');
const router = express.Router();
const { addSpecialIngredient,getSpecialIngredients ,updateSpecialIngredientDetails,deleteSpecialIngredientDetails} = require('../controllers/specialController');
// POST /api/ingredient → Create a new ingredient
router.post('/', addSpecialIngredient);

// GET /api/ingredient → Fetch all ingredients
router.get('/', getSpecialIngredients);

// Route to update a product
router.put('/:id', updateSpecialIngredientDetails);

// Route to delete a product
router.delete('/:id', deleteSpecialIngredientDetails);




module.exports = router;


