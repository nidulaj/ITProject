const express = require("express");
const router = express.Router();

const {addRole,
  getAllUserRoles} = require("../controllers/userRoleController");
  const {staffAuthMiddleware} = require("../middlewares/staffAuthMiddleware");



router.post("/createRole", staffAuthMiddleware, addRole);
router.get("/getAllRoles", staffAuthMiddleware, getAllUserRoles);

module.exports = router;