// routes/productionRoutes.js
const express = require("express");
const router = express.Router();
const {
  startFromRequest,
  list,
} = require("../controllers/productionController");

// Create production from accepted request
router.post("/start-from-request/:req_id", startFromRequest);

// List productions (auto-complete happens inside)
router.get("/", list);

module.exports = router;
