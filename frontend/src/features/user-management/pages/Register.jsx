import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [userData, setUserData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = React.useState("");
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const navigate = useNavigate();


  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1; 
    if (/[A-Z]/.test(password)) strength += 1; 
    if (/[a-z]/.test(password)) strength += 1; 
    if (/[0-9]/.test(password)) strength += 1; 
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; 
    return strength;
  };


const handleChange = (e) => {
  const { name, value } = e.target;

  setUserData((prev) => {
    const newUserData = { ...prev, [name]: value };


    if (name === "password") {
      setPasswordStrength(calculateStrength(value));
    }

    if (name === "password" || name === "confirmPassword") {
      if (newUserData.password && newUserData.confirmPassword && newUserData.password !== newUserData.confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }

    return newUserData;
  });
};



  const handleNameChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
    setUserData((prev) => ({ ...prev, [name]: filteredValue }));
  };


  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/(?!^\+)\D/g, "");
    setUserData((prev) => ({ ...prev, [name]: filteredValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || passwordStrength < 4) {
      alert("Please fix the errors before submitting");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
      console.log(res.data.message);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };

  const isPasswordValid = passwordStrength >= 4 && userData.password === userData.confirmPassword;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-700 px-4 py-8">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 w-full max-w-md transition-all duration-500 hover:shadow-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Join Smart Dairy today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              onChange={handleNameChange}
              placeholder="John"
              value={userData.firstName}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              required
              onChange={handleNameChange}
              placeholder="Doe"
              value={userData.lastName}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="your@email.com"
              value={userData.email}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              required
              onChange={handlePhoneChange}
              placeholder="+94 7xxxxxxx"
              value={userData.phone}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              onChange={handleChange}
              placeholder="123 Main St"
              value={userData.address}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              placeholder="Enter your password"
              value={userData.password}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />

            {/* Password Strength Bar */}
            <div className="h-2 w-full bg-gray-200 rounded mt-1">
              <div
                className={`h-2 rounded ${
                  passwordStrength <= 2
                    ? "bg-red-500"
                    : passwordStrength === 3
                    ? "bg-yellow-400"
                    : passwordStrength >= 4
                    ? "bg-green-500"
                    : ""
                }`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {passwordStrength <= 2
                ? "Weak"
                : passwordStrength === 3
                ? "Medium"
                : passwordStrength >= 4
                ? "Strong"
                : ""}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              onChange={handleChange}
              placeholder="Re-enter your password"
              value={userData.confirmPassword}
              className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isPasswordValid}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 ${
              !isPasswordValid ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Sign in now
          </Link>
        </p>
      </div>
    </div>
  );
}
