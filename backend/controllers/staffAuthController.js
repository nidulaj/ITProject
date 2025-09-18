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
} = require("../models/staffAuthModel");
const {
  generateAccessTokenStaff,
  generateRefreshTokenStaff,
  generateTempTokenStaff,
} = require("../utils/token");
const {
  send2FACode,
  sendVerificationLink,
  sendResetPasswordLink,
  sendStaffRegistrationInfo
} = require("../utils/emailService");

const {generatePassword} = require("../utils/passwordGenerator");

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
    await sendStaffRegistrationInfo(email,password);
    await createLog(staffUser.staff_code, "New User Registered", req.ip);
    res
      .status(201)
      .json({ message: "Staff registered successfully", staffUser });
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
      await createLog(staffUser.staff_code, "Failed Login Attempt", req.ip);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!staffUser.is_active) {
      await createLog(staffUser.staff_code, "Disabled Account Login Attempt", req.ip);
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

      return res
        .status(200)
        .json({
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

    await createLog(staffUser.staff_code, "Refreshed Access Token", req.ip);

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
  console.log(staffId, code);

  try {
    const verificationInfo = await getVerificationDetails(staffId);

    if (new Date() > new Date(verificationInfo.verification_code_expires)) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (!code || Number(verificationInfo.verification_code) !== Number(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    await deleteVerificationCode(staffId);
    const user = req.user;
    const accessToken = generateAccessTokenStaff(user);
    const refreshToken = generateRefreshTokenStaff(user);
    const staffUser = await findUserById(staffId);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.clearCookie("tempToken");

    await createLog(staffUser.staff_code, "Logged In", req.ip);
    res
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
        refreshToken,
        role: user.role,
      });
  } catch (error) {
    console.error("Error verifying code:", error);
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

module.exports = {
  registerStaff,
  loginStaff,
  refreshToken,
  logout,
  verify2FACode,
  resend2FACode,
  getStaffList,
};
