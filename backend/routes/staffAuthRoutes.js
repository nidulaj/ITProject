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
  getStaffList
} = require("../controllers/staffAuthController");

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.post("/refresh-token", refreshToken);
router.post("/logout", staffAuthMiddleware, logout);
router.post("/verify2FA", staffTempMiddleware, verify2FACode);
router.post("/resend2FA", staffTempMiddleware, resend2FACode);
router.get("/staffList", staffAuthMiddleware, getStaffList);

module.exports = router;
