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
  resend2FACode,
  googleLogin,
  getAllCustomerDetails,
  getCustomerDetails,
   updateUserDetails,
  updatePassword,
  change2FASetting,
  uploadCustomerProfilePhoto,
  removeCustomerProfilePhoto,
  removeCustomerAccount
} = require("../controllers/customerAuthController");

const upload = require("../middlewares/uploadMiddleware");

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/google-login", googleLogin);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/profile/delete", authMiddleware, selfDeleteUserProfile);
router.post("/refresh",  refreshToken);
router.post("/logout", authMiddleware, logout);
router.post("/verify-phone", authMiddleware, phoneNumberVerificationSend);
router.post("/verify-code", authMiddleware, verifyVerificationCode);
router.post("/verify-2fa", tempMiddleware, verify2FACode);
router.get("/verify-email", verifyEmail);
router.post("/resend-2fa", tempMiddleware, resend2FACode);

router.get("/allCustomers", authMiddleware, getAllCustomerDetails);
router.get("/userInfo", authMiddleware, getCustomerDetails);

router.put("/updateUserDetails", authMiddleware, updateUserDetails);
router.put("/updatePassword", authMiddleware, updatePassword);
router.put("/change2FA", authMiddleware, change2FASetting);
router.post("/uploadProfilePhoto", authMiddleware, upload.single("profilePhoto"), uploadCustomerProfilePhoto);
router.delete("/removeProfilePhoto", authMiddleware, removeCustomerProfilePhoto);
module.exports = router;
