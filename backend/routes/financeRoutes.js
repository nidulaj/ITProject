const express = require("express");
const router = express.Router();
const { getFinanceStats } = require("../controllers/financeController");

router.get("/stats", getFinanceStats);

module.exports = router;
