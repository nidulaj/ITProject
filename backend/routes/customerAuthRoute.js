const express = require("express");
const router = express.Router();
const {authMiddleware, tempMiddleware} = require("../middlewares/authMiddleware");
const {
  registerCustomer,
  loginCustomer,
  updateUserProfile,
  selfDeleteUserProfile,
  refreshToken,
  logout,
  phoneNumberVerificationSend,
  verifyVerificationCode,
  verify2FACode,
  verifyEmail,
  resend2FACode
} = require("../controllers/customerAuthController");

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/profile/delete", authMiddleware, selfDeleteUserProfile);
router.post("/refresh",  refreshToken);
router.post("/logout", authMiddleware, logout);
router.post("/verify-phone", authMiddleware, phoneNumberVerificationSend);
router.post("/verify-code", authMiddleware, verifyVerificationCode);
router.post("/verify-2fa", tempMiddleware, verify2FACode);
router.get("/verify-email", verifyEmail);
router.post("/resend-2fa", tempMiddleware, resend2FACode);

module.exports = router;
