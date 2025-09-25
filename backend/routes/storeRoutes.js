/*const express = require('express');
const router = express.Router();
const { addZone,getZone ,updateZoneDetails,deleteZoneDetails} = require('../controllers/storeController');
// POST /api/ingredient → Create a new ingredient
router.post('/', addZone);

// GET /api/ingredient → Fetch all ingredients
router.get('/', getZone);

// Route to update a product
router.put('/:id', updateZoneDetails);

// Route to delete a product
router.delete('/:id', deleteZoneDetails);




module.exports = router;*/

const express = require('express');
const router = express.Router();
const { addZone, getZone, updateZoneDetails, deleteZoneDetails } = require('../controllers/storeController');
const {
  staffAuthMiddleware
} = require("../middlewares/staffAuthMiddleware");

router.post('/',staffAuthMiddleware, addZone);          // Create new zone
router.get('/',staffAuthMiddleware, getZone);           // Get all zones
router.put('/:id',staffAuthMiddleware, updateZoneDetails);  // Update zone by ID
router.delete('/:id',staffAuthMiddleware, deleteZoneDetails); // Delete zone by ID

module.exports = router;
