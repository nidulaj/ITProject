const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const {
  createCustomer,
  findCustomerByEmail,
  login,
  updateProfile,
  selfDeleteProfile,
  storeVerificationCode,
  getVerificationDetails,
  deleteVerificationCode,
  emailVerification,
  findUserById,
  findUserByGoogleId,
  attachGoogleIdToUser,
  getAllCustomers,
 updateCustomerDetails,
  getCurrentPassword,
  changePassword,
  change2FA,
  updateProfilePhoto,
  removeProfilePhoto,
  removeUser,
  changeAccountStatus
} = require("../models/customerAuthModel");
const {
  generateAccessToken,
  generateRefreshToken,
  generateTempToken,
  generateEmailVerificationToken,
  generateResetPasswordToken
} = require("../utils/token");
const { sendSMS } = require("../utils/smsService");
const {
  send2FACode,
  sendVerificationLink,
  sendResetPasswordLink,
} = require("../utils/emailService");

const {createLog} = require("../models/userManagementAuditLogModel");
const { ref } = require("process");

const registerCustomer = async (req, res) => {
  const { firstName, lastName, email, phone, address, password } = req.body;

  try {
    const existingCustomer = await findCustomerByEmail(email);

    if (existingCustomer) {
      return res.status(409).json({ message: "User already exists" });
    }

    const customer = await createCustomer(
      firstName,
      lastName,
      email,
      phone,
      address,
      password
    );
    await createLog(customer.customer_code, "New User Registered", req.ip);
    res
      .status(201)
      .json({ message: "Customer registered successfully", customer });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await login(email, password);
    if (!customer) {
      const triedUser = await findCustomerByEmail(email);
      await createLog(triedUser.customer_code, "Failed Login Attempt", req.ip);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!customer.is_active) {
      await createLog(customer.customer_code, "Disabled Account Login Attempt", req.ip);
      return res.status(403).json({ message: "Account is disabled" });
    }

    if (!customer.is_email_verified) {
      const verificationToken = generateEmailVerificationToken(customer);
      const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
      await sendVerificationLink(customer.email, verificationLink);
      return res.status(403).json({ message: "Account not verified. Verification link sent." });
    }
    console.log("Customer is 2FA enabled", customer.is_2FA_enabled);

    if (customer.is_2FA_enabled) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      await send2FACode(customer.email, verificationCode);
      await storeVerificationCode(customer.cus_id, verificationCode);

      const tempToken = generateTempToken(customer);

      res.cookie("tempToken", tempToken, {
        httpOnly: true,
        secure: false, // set true in production (HTTPS)
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      return res
        .status(200)
        .json({ message: "2FA code sent to email", is_2FA_enabled: true, role: null, type: "customer" });
    }

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

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
    await createLog(customer.customer_code, "Logged In", req.ip);
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken, role: null });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleLogin = async (req, res) => {
  console.log("Incoming Google login body:", req.body);

  const {token} = req.body

  if(!token){
    return res.status(400).json({message: "No token provided"})
  }

  try{
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    const email = payload.email
    const googleId = payload.sub
    const firstName = payload.given_name || ""
    const lastName = payload.family_name || ""
    const avatarUrl = payload.picture || null;

    const existingByGoogle = await findUserByGoogleId(googleId);

    if(existingByGoogle){
      var customer = existingByGoogle

    }else{
      const existingByEmail = await findCustomerByEmail(email);

      if(existingByEmail){
        customer = await attachGoogleIdToUser(existingByEmail.cus_id, googleId);

      }else{
        const randomPassword = crypto.randomBytes(16).toString("hex")
      
        customer = await createCustomer(firstName, lastName, email, null, null, randomPassword)
        await emailVerification(customer.cus_id)
        customer = await attachGoogleIdToUser(customer.cus_id, googleId);
      }
    }

    if (!customer.is_active) {
      await createLog(customer.customer_code, "Disabled Account Login Attempt", req.ip);
      return res.status(403).json({ message: "Account is disabled" });
    }

    if(customer.is_2FA_enabled){
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      await send2FACode(customer.email, verificationCode);
      await storeVerificationCode(customer.cus_id, verificationCode);

      const tempToken = generateTempToken(customer);

      res.cookie("tempToken", tempToken, {
        httpOnly: true,
        secure: false, // set true in production (HTTPS)
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      return res
        .status(200)
        .json({ message: "2FA code sent to email", is_2FA_enabled: true });
    }

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

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
    await createLog(customer.customer_code, "Logged In with Google", req.ip);
    return res.status(200).json({message: "Login successful", accessToken, refreshToken})
  }catch(err){
    console.error("Google login failed:", err);
    return res.status(400).json({ message: "Google login failed" });
  }
}

const updateUserProfile = async (req, res) => {
  const { id, firstName, lastName, phone, address } = req.body;

  try {
    const updatedCustomer = await updateProfile(
      id,
      firstName,
      lastName,
      phone,
      address
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await createLog(updatedCustomer.customer_code, "Updated Profile", req.ip);
    res.status(200).json({
      message: "Customer profile updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const selfDeleteUserProfile = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedCustomer = await selfDeleteProfile(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Account deleted. Recoverable for 30 days.",
      customer: deletedCustomer,
    });
  } catch (error) {
    console.error("Error deleting customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(user);
    const customer = await findUserById(user.id);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    await createLog(customer.customer_code, "Refreshed Access Token", req.ip);
    res.status(200).json({
      message: "Access Tokens refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  const customer = await findUserById(req.user.id);
  await createLog(customer.customer_code, "Logged Out", req.ip);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
};

const phoneNumberVerificationSend = async (req, res) => {
  const { customerId, phoneNumber } = req.body;

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // await sendSMS(phoneNumber, verificationCode);
    await storeVerificationCode(customerId, verificationCode);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyVerificationCode = async (req, res) => {
  const customerId = req.user.id;
  const { code } = req.body;
  console.log(customerId, code);

  try {
    const verificationInfo = await getVerificationDetails(customerId);

    if (new Date() > new Date(verificationInfo.verification_code_expires)) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (!code || Number(verificationInfo.verification_code) !== Number(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await deleteVerificationCode(customerId);
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// controllers/customerAuthController.js (modify verify2FACode)
const verify2FACode = async (req, res) => {
  // Get ID from decoded temp token payload (support multiple property names)
  const tempUser = req.user || {};
  const customerId = tempUser.id || tempUser.cus_id || tempUser.userId;

  const { code } = req.body;

  try {
    const verificationInfo = await getVerificationDetails(customerId);

    if (new Date() > new Date(verificationInfo.verification_code_expires)) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (!code || Number(verificationInfo.verification_code) !== Number(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Clear verification code
    await deleteVerificationCode(customerId);

    // --- IMPORTANT: fetch full user from DB and use that to generate tokens ---
    const customerFromDb = await findUserById(customerId);
    if (!customerFromDb) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const accessToken = generateAccessToken(customerFromDb);
    const refreshToken = generateRefreshToken(customerFromDb);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // remove temp token
    res.clearCookie("tempToken");

    await createLog(customerFromDb.customer_code, "Logged In", req.ip);

    return res.status(200).json({
      message: "Login successful",
      role: customerFromDb.role || null,
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const verifyEmail = async (req, res) => {
  const token = req.query.token;

  try {
  const user = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
  console.log("Email verification token valid for user:", user);

  const customerId = user.id;
  const customer = await findUserById(customerId);

  console.log("Calling emailVerification with customerId:", customerId);

  const newStatus = await emailVerification(customerId);

  res.redirect("http://localhost:5173/verifyEmail");
  await createLog(customer.customer_code, "Email Verified", req.ip);
} catch (err) {
  console.error("Error in verifyEmail:", err);
  res.status(400).json({ message: "Invalid or expired token" });
}

};

const resend2FACode = async (req, res) => {
  const customerId = req.user.id;

  try {
    const customer = await findUserById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await send2FACode(customer.email, verificationCode);
    await storeVerificationCode(customerId, verificationCode);

    res.status(200).json({ message: "2FA code resent to email" });
  } catch (error) {
    console.error("Error resending 2FA code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCustomerDetails = async (req, res) => {
  try {
      const customers = await getAllCustomers();
      res.status(200).json(customers);
  } catch (error) {
      console.error("Error fetching customer details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const getCustomerDetails = async (req, res) => {
  const customerId = req.user.id;

  try {
    const customer = await findUserById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserDetails = async (req, res) => {
  const customerId = req.user.id;
  const { first_name, last_name, phone, address } = req.body;

  try {
    const updatedUser = await updateCustomerDetails(customerId, {
      first_name,
      last_name,
      phone,
      address
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  const customerId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const currentPass = await getCurrentPassword(customerId);
    if (currentPass.password !== currentPassword) {
      console.log("Current password is incorrect");
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const updatedPasswordUser = await changePassword(customerId, newPassword);
    const newAccessToken = generateAccessToken(updatedPasswordUser);
    const newRefreshToken = generateRefreshToken(updatedPasswordUser);

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
  const customerId = req.user.id;
  const { is2FAEnabled } = req.body;

  try {
    const updatedCustomer = await change2FA(customerId, is2FAEnabled);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error changing 2FA setting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadCustomerProfilePhoto = async (req, res) => {
  console.log("File received:");
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const customerId = req.user.id;
    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updatedUser = await updateProfilePhoto(customerId, photoUrl);
    console.log("Profile photo updated:", updatedUser);

    res.status(200).json({
      message: "Profile photo updated successfully",
      photoUrl: updatedUser.profile_photo,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeCustomerProfilePhoto = async (req, res) => {
  try {
    const customerId = req.user.id;
    const removedPhoto = await removeProfilePhoto(customerId);
    res.status(200).json({
      message: "Profile photo removed successfully",
      removedPhoto,
    });
  } catch (error) {
    console.error("Error removing photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getCustomerDetailsForAdmin = async (req, res) => {
  const customerId = parseInt(req.params.id, 10);

  try {
    const customer = await findUserById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changeAccountActivation = async (req, res) => {
  const { customerId } = req.params;
  const { isActive, deactivationPeriod } = req.body;
  console.log(deactivationPeriod);

  try {
    const updatedCustomer = await changeAccountStatus(
      customerId,
      isActive,
      deactivationPeriod
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error changing account activation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const change2FASettingByAdmin = async (req, res) => {
  const { customerId } = req.params;
  const { is2FAEnabled } = req.body;

  try {
    const updatedCustomer = await change2FA(customerId, is2FAEnabled);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error changing 2FA setting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const changeCustomerDetailsByAdmin = async (req, res) => {
  const { customerId } = req.params;
  const { first_name, last_name, phone, address } = req.body;

  try {
    const updatedCustomer = await updateCustomerDetails(customerId, {
      first_name,
      last_name,
      phone,
      address
    });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeCustomerAccount = async (req, res) => {
  const { customerId } = req.params;

  try {
    const removedUser = await removeUser(customerId);
    res
      .status(200)
      .json({ message: "Customer account removed successfully", removedUser });
  } catch (error) {
    console.error("Error removing customer account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findCustomerByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateResetPasswordToken(user);
    await sendResetPasswordLink(email, resetToken, "customer");

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

   const updatedUser = await changePassword(user.cus_id, newPassword);
   await createLog(updatedUser.customer_code, "Password Reset", req.ip);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
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
  removeCustomerAccount,
  getCustomerDetailsForAdmin,
  changeAccountActivation,
  change2FASettingByAdmin,
  changeCustomerDetailsByAdmin,
  forgotPassword,
  resetPassword
};
