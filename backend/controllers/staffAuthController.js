const jwt = require("jsonwebtoken");
const {
  createStaff,
  staffLogin,
  findStaffByEmail,
  storeVerificationCode,
  getVerificationDetails,
  deleteVerificationCode,
  findUserById,
  getAllStaff,
  getStaffByRole,
  getStaffById,
  changeRole,
  changeAccountStatus,
  change2FA,
  updateStaffDetails,
  removeUser,
  changePassword,
  getCurrentPassword,
  updateProfilePhoto,
  removeProfilePhoto,
  getStaffActivationCount,
  getStaffCount
} = require("../models/staffAuthModel");
const {
  generateAccessTokenStaff,
  generateRefreshTokenStaff,
  generateTempTokenStaff,
  generateResetPasswordTokenStaff
} = require("../utils/token");
const {
  send2FACode,
  sendVerificationLink,
  sendResetPasswordLink,
  sendStaffRegistrationInfo,
} = require("../utils/emailService");

const { generatePassword } = require("../utils/passwordGenerator");

const { createLog } = require("../models/userManagementAuditLogModel");

const registerStaff = async (req, res) => {
  const { firstName, lastName, email, phone, role } = req.body;

  try {
    const existingUser = await findStaffByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const password = generatePassword();
    const staffUser = await createStaff(
      firstName,
      lastName,
      email,
      phone,
      password,
      role
    );
    await sendStaffRegistrationInfo(email, password);
    await createLog(staffUser.staff_code, "New User Registered", req.ip);
    res.status(201).json(staffUser);
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staffUser = await staffLogin(email, password);
    if (!staffUser) {
      const triedUser = await findStaffByEmail(email);
      await createLog(triedUser.staff_code, "Failed Login Attempt", req.ip);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!staffUser.is_active) {
      await createLog(
        staffUser.staff_code,
        "Disabled Account Login Attempt",
        req.ip
      );
      return res.status(403).json({ message: "Account is disabled" });
    }

    if (staffUser.is_2FA_enabled) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      await send2FACode(staffUser.email, verificationCode);
      await storeVerificationCode(staffUser.staff_id, verificationCode);

      const tempToken = generateTempTokenStaff(staffUser);

      res.cookie("tempToken", tempToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        message: "2FA code sent",
        is_2FA_enabled: true,
        role: staffUser.role,
        type: "staff",
      });
    }

    const accessToken = generateAccessTokenStaff(staffUser);
    const refreshToken = generateRefreshTokenStaff(staffUser);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    await createLog(staffUser.staff_code, "Logged In", req.ip);
    res.status(200).json({
      message: "Login successful",
      id: staffUser.staff_code,
      accessToken,
      refreshToken,
      role: staffUser.role,
      user: staffUser
    });
  } catch (error) {
    console.error("Error logging in staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const staffUser = await findUserById(payload.id);
    if (!staffUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessTokenStaff(staffUser);
    const newRefreshToken = generateRefreshTokenStaff(staffUser);

    // Reset cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Tokens refreshed",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  const staffId = req.user.id;
  const staffUser = await findUserById(staffId);
  await createLog(staffUser.staff_code, "Logged Out", req.ip);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
};

const verify2FACode = async (req, res) => {
  const staffId = req.user.id;
  const { code } = req.body;

  try {
    const verificationInfo = await getVerificationDetails(staffId);

    if (new Date() > new Date(verificationInfo.verification_code_expires)) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (!code || Number(verificationInfo.verification_code) !== Number(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // ✅ Remove verification code once verified
    await deleteVerificationCode(staffId);

    // ✅ Fetch full staff user from DB
    const staffFromDb = await findUserById(staffId);
    if (!staffFromDb) {
      return res.status(404).json({ message: "Staff user not found" });
    }

    // ✅ Generate fresh tokens based on full user
    const accessToken = generateAccessTokenStaff(staffFromDb);
    const refreshToken = generateRefreshTokenStaff(staffFromDb);

    // ✅ Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Clear temp token
    res.clearCookie("tempToken");

    // ✅ Log login
    await createLog(staffFromDb.staff_code, "Logged In", req.ip);

    // ✅ Send complete user object back to frontend
    return res.status(200).json({
      message: "Login successful",
      role: staffFromDb.role || null,
      user: staffFromDb, // 👈 This ensures frontend gets full userInfo
    });
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const resend2FACode = async (req, res) => {
  const staffId = req.user.id;

  try {
    const staffUser = await findUserById(staffId);
    if (!staffUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await send2FACode(staffUser.email, verificationCode);
    await storeVerificationCode(staffId, verificationCode);

    res.status(200).json({ message: "2FA code resent to email" });
  } catch (error) {
    console.error("Error resending 2FA code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStaffList = async (req, res) => {
  try {
    const staffList = await getAllStaff();
    res.status(200).json(staffList);
  } catch (error) {
    console.error("Error fetching staff list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStaffInfoByRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const staffMembers = await getStaffByRole(roleId);
    res.status(200).json(staffMembers);
  } catch (error) {
    console.error("Error fetching staff by role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStaffDetailsById = async (req, res) => {
  const { staffId } = req.params;
  try {
    const staffDetails = await getStaffById(staffId);
    res.status(200).json(staffDetails);
  } catch (error) {
    console.error("Error fetching staff details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changeUserRole = async (req, res) => {
  const { staffId } = req.params;
  const { roleId } = req.body;
  try {
    const updatedRole = await changeRole(roleId, staffId);
    if (!updatedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const changeAccountActivation = async (req, res) => {
  const { staffId } = req.params;
  const { isActive, deactivationPeriod } = req.body;
  console.log(deactivationPeriod);

  try {
    const updatedStaff = await changeAccountStatus(
      staffId,
      isActive,
      deactivationPeriod
    );
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error("Error changing account activation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const change2FASettingByAdmin = async (req, res) => {
  const { staffId } = req.params;
  const { is2FAEnabled } = req.body;

  try {
    const updatedStaff = await change2FA(staffId, is2FAEnabled);
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error("Error changing 2FA setting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const changeStaffDetailsByAdmin = async (req, res) => {
  const { staffId } = req.params;
  const { first_name, last_name, phone } = req.body;

  try {
    const updatedStaff = await updateStaffDetails(staffId, {
      first_name,
      last_name,
      phone,
    });
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeStaffAccount = async (req, res) => {
  const { staffId } = req.params;

  try {
    const removedUser = await removeUser(staffId);
    res
      .status(200)
      .json({ message: "Staff member removed successfully", removedUser });
  } catch (error) {
    console.error("Error removing staff member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserInfo = async (req, res) => {
  const staffId = req.user.id;
  console.log(req.user.id);

  try {
    const userInfo = await getStaffById(staffId);
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserDetails = async (req, res) => {
  const staffId = req.user.id;
  const { first_name, last_name, phone } = req.body;

  try {
    const updatedUser = await updateStaffDetails(staffId, {
      first_name,
      last_name,
      phone,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  const staffId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const currentPass = await getCurrentPassword(staffId);
    if (currentPass.password !== currentPassword) {
      console.log("Current password is incorrect");
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const updatedPasswordUser = await changePassword(staffId, newPassword);
    const newAccessToken = generateAccessTokenStaff(updatedPasswordUser);
    const newRefreshToken = generateRefreshTokenStaff(updatedPasswordUser);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json(updatedPasswordUser);
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const change2FASetting = async (req, res) => {
  const staffId = req.user.id;
  const { is2FAEnabled } = req.body;

  try {
    const updatedStaff = await change2FA(staffId, is2FAEnabled);
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error("Error changing 2FA setting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadStaffProfilePhoto = async (req, res) => {
  console.log("File received:");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const staffId = req.user.id;
    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updatedUser = await updateProfilePhoto(staffId, photoUrl);

    res.status(200).json({
      message: "Profile photo updated successfully",
      photoUrl: updatedUser.profile_photo,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeStaffProfilePhoto = async (req, res) => {
  try {
    const staffId = req.user.id;
    const removedPhoto = await removeProfilePhoto(staffId);
    res.status(200).json({
      message: "Profile photo removed successfully",
      removedPhoto,
    });
  } catch (error) {
    console.error("Error removing photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findStaffByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateResetPasswordTokenStaff(user);
    await sendResetPasswordLink(email, resetToken, "staff");

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   const updatedUser = await changePassword(user.staff_id, newPassword);
   await createLog(updatedUser.staff_code, "Password Reset", req.ip);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getActiveStaffCount = async (req,res) =>{
  try{
    const activationCounts = await getStaffActivationCount();
    console.log("Activation counts:", activationCounts);
    res.status(200).json(activationCounts);
  }catch(error){
    console.error("Error fetching activation counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStaffCountByAdmin = async (req, res) => {
  try {
    const count = await getStaffCount();
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching staff count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerStaff,
  loginStaff,
  refreshToken,
  logout,
  updatePassword,
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
  change2FASetting,
  uploadStaffProfilePhoto,
  removeStaffProfilePhoto,
  forgotPassword,
  resetPassword,
  getActiveStaffCount,
  getStaffCountByAdmin
};
