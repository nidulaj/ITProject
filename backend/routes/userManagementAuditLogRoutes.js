const express = require("express");
const router = express.Router();
const {createAuditLog} = require("../controllers/usermanagementAuditController");

router.post("/create", createAuditLog);



module.exports = router;