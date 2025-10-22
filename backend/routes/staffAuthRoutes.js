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
  change2FASettingByAdmin,
  changeStaffDetailsByAdmin,
  removeStaffAccount,
  getUserInfo,
  updateUserDetails,
  updatePassword,
  change2FASetting,
  uploadStaffProfilePhoto,
  removeStaffProfilePhoto,
  forgotPassword,
  resetPassword,
  getActiveStaffCount,
  getStaffCountByAdmin
} = require("../controllers/staffAuthController");

const upload = require("../middlewares/uploadMiddleware");

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
router.put("/change2FA/:staffId", staffAuthMiddleware, change2FASettingByAdmin);
router.put("/changeStaffDetails/:staffId", staffAuthMiddleware, changeStaffDetailsByAdmin);
router.put("/removeStaff/:staffId", staffAuthMiddleware, removeStaffAccount);
router.get("/userInfo", staffAuthMiddleware, getUserInfo);
router.put("/updateUserDetails", staffAuthMiddleware, updateUserDetails);
router.put("/updatePassword", staffAuthMiddleware, updatePassword);
router.put("/change2FA", staffAuthMiddleware, change2FASetting);
router.post("/uploadProfilePhoto", staffAuthMiddleware, upload.single("profilePhoto"), uploadStaffProfilePhoto);
router.delete("/removeProfilePhoto", staffAuthMiddleware, removeStaffProfilePhoto);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/activeStaffCount", staffAuthMiddleware, getActiveStaffCount);
router.get("/staffCount", staffAuthMiddleware, getStaffCountByAdmin);
module.exports = router;
