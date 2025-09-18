const express = require("express");
const router = express.Router();
const {
  staffAuthMiddleware,
} = require("../middlewares/staffAuthMiddleware");
const {createAuditLog , getAllAuditLogs} = require("../controllers/usermanagementAuditController");

router.post("/create", createAuditLog);
router.get("/logs", staffAuthMiddleware, getAllAuditLogs);

module.exports = router;