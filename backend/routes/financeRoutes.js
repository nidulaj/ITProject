const express = require("express");
const router = express.Router();
const { getFinanceStats, getRecentActivity  } = require("../controllers/financeController");
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");

router.get("/stats", staffAuthMiddleware, getFinanceStats);
router.get("/recent-activity", getRecentActivity);

module.exports = router;
