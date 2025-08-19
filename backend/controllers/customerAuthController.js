const {
  createCustomer,
  findUserByEmail,
  login,
  updateProfile,
  selfDeleteProfile,
} = require("../models/customerAuthModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const jwt = require("jsonwebtoken");


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
    res.status(201).json(customer);
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

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // set true in production (HTTPS)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


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

    res
      .status(200)
      .json({
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

    res
      .status(200)
      .json({
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
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    }); 

    res.status(200).json({ message: "Access Tokens refreshed", accessToken: newAccessToken});
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

module.exports = {
  registerCustomer,
  loginCustomer,
  updateUserProfile,
  selfDeleteUserProfile,
  refreshToken,
  logout
};
