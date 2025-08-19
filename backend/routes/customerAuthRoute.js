const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerCustomer,
  loginCustomer,
  updateUserProfile,
  selfDeleteUserProfile,
  refreshToken,
  logout,
  phoneNumberVerificationSend,
  verifyVerificationCode,
} = require("../controllers/customerAuthController");

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/profile/delete", authMiddleware, selfDeleteUserProfile);
router.post("/refresh", authMiddleware, refreshToken);
router.post("/logout", authMiddleware, logout);
router.post("/verify-phone", authMiddleware, phoneNumberVerificationSend);
router.post("/verify-code", authMiddleware, verifyVerificationCode);

module.exports = router;
