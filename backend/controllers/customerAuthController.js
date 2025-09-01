const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const {
  createCustomer,
  findUserByEmail,
  login,
  updateProfile,
  selfDeleteProfile,
  storeVerificationCode,
  getVerificationDetails,
  deleteVerificationCode,
  emailVerification,
  findUserById,
  findUserByGoogleId,
  attachGoogleIdToUser
} = require("../models/customerAuthModel");
const {
  generateAccessToken,
  generateRefreshToken,
  generateTempToken,
  generateEmailVerificationToken
} = require("../utils/token");
const { sendSMS } = require("../utils/smsService");
const {
  send2FACode,
  sendVerificationLink,
  sendResetPasswordLink,
} = require("../utils/emailService");

const registerCustomer = async (req, res) => {
  const { firstName, lastName, email, phone, address, password } = req.body;

  try {
    const existingCustomer = await findUserByEmail(email);

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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!customer.is_active) {
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
        .json({ message: "2FA code sent to email", is_2FA_enabled: true });
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
    console.log("Login successful, tokens set in cookies");
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
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
      const existingByEmail = await findUserByEmail(email);

      if(existingByEmail){
        customer = await attachGoogleIdToUser(existingByEmail.cus_id, googleId);

      }else{
        const randomPassword = crypto.randomBytes(16).toString("hex")
      
        customer = await createCustomer(firstName, lastName, email, null, null, randomPassword)
        await emailVerification(customer.cus_id)
        customer = await attachGoogleIdToUser(customer.cus_id, googleId);
      }
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

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      message: "Access Tokens refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
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

const verify2FACode = async (req, res) => {
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
    const customer = req.user;
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

    res.clearCookie("tempToken");

    console.log("Login successful, tokens set in cookies");
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
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

  console.log("Calling emailVerification with customerId:", customerId);

  const newStatus = await emailVerification(customerId);

  console.log("Email verified, updated user:", newStatus);

  res.redirect("http://localhost:5173/verifyEmail");
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
  googleLogin
};
