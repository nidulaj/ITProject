const express = require("express");
const router = express.Router();
const { getFinanceStats, getRecentActivity, getChartData } = require("../controllers/financeController");
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");

router.get("/stats", staffAuthMiddleware, getFinanceStats);
router.get("/recent-activity", staffAuthMiddleware, getRecentActivity);
router.get("/chart-data", staffAuthMiddleware, getChartData);

module.exports = router;
