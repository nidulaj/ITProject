const express = require("express");
const router = express.Router();
const {
  staffAuthMiddleware,
  staffTempMiddleware,
} = require("../middlewares/staffAuthMiddleware");
const {
  registerStaff,
  loginStaff,
  refreshToken,
  logout,
  verify2FACode,
  resend2FACode,
  getStaffList,
  getStaffInfoByRole,
  getStaffDetailsById,
  changeUserRole,
  changeAccountActivation,
  change2FASetting,
  changeStaffDetailsByAdmin
} = require("../controllers/staffAuthController");

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.post("/refresh-token", refreshToken);
router.post("/logout", staffAuthMiddleware, logout);
router.post("/verify2FA", staffTempMiddleware, verify2FACode);
router.post("/resend2FA", staffTempMiddleware, resend2FACode);
router.get("/staffList", staffAuthMiddleware, getStaffList);
router.get("/staffInfo/:roleId", staffAuthMiddleware, getStaffInfoByRole);
router.get("/staffDetails/:staffId",  getStaffDetailsById);
router.put("/changeRole/:staffId", staffAuthMiddleware, changeUserRole);
router.put("/changeAccountStatus/:staffId", staffAuthMiddleware, changeAccountActivation);
router.put("/change2FA/:staffId", staffAuthMiddleware, change2FASetting);
router.put("/changeStaffDetails/:staffId", staffAuthMiddleware, changeStaffDetailsByAdmin);

module.exports = router;
