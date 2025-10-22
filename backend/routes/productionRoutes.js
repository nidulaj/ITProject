// routes/productionRoutes.js
const express = require("express");
const router = express.Router();

const {
  startFromRequest,
  list,
  markProductionDelivered,
} = require("../controllers/productionController");

// Create production from an accepted request
router.post("/start-from-request/:req_id", startFromRequest);

// List all productions
router.get("/", list);

// Mark a production as delivered
router.patch("/delivered/:batch_id", markProductionDelivered);

module.exports = router;
