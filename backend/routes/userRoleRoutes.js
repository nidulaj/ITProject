const express = require("express");
const router = express.Router();

const {
  addRole,
  getAllUserRoles,
  deleteUserRole,
  getUserRoleInfoById,
  updateUserRole,
  getUserRoleCountByAdmin
} = require("../controllers/userRoleController");
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");

router.post("/createRole", staffAuthMiddleware, addRole);
router.get("/getAllRoles", staffAuthMiddleware, getAllUserRoles);
router.delete("/deleteRole", staffAuthMiddleware, deleteUserRole);
router.get("/getRoleById/:roleId", staffAuthMiddleware, getUserRoleInfoById);
router.put("/updateRole/:roleId", staffAuthMiddleware, updateUserRole);
router.get("/roleCount", staffAuthMiddleware, getUserRoleCountByAdmin);
module.exports = router;
