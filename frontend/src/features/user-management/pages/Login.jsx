import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Header from "../../../components/DashboardHeader";
import { CartProvider } from "../../../contexts/CartContext";
import Swal from "sweetalert2";

export default function Login() {
  const { setUser, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("customer"); // "customer" or "staff"
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        mode === "customer"
          ? "http://localhost:5000/api/auth/forgot-password"
          : "http://localhost:5000/api/staff/auth/forgot-password";

      const res = await axios.post(endpoint, { email: forgotPasswordEmail });

      console.log(`Forgot password for ${mode}:`, forgotPasswordEmail);
      setShowForgotPasswordModal(false);
      setForgotPasswordEmail("");
      Swal.fire({
        title: "Success!",
        text: "Password reset email sent successfully.",
        icon: "success",
      });
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        Swal.fire({
          title: "Error",
          text: err.response.data.message,
          icon: "error",
        });
      } else {
        console.error(err.message);
        Swal.fire({
          title: "Error",
          text: "Something went wrong. Please try again.",
          icon: "error",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        mode === "customer"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/staff/auth/login";

      const res = await axios.post(endpoint, credentials, {
        withCredentials: true,
      });

      const { role, user: loggedInUser } = res.data;
      setUser(loggedInUser);
      console.log("Logged in user:", loggedInUser);

      if (res.data.is_2FA_enabled) {
        navigate("/verify2FA", {
          state: { role: res.data.role, type: res.data.type },
        });
      } else {
        setIsLoggedIn(true);
        if (!role) {
          navigate("/dashboard");
        } else {
          if (role === 1) navigate("/dashboard/admin");
          else if (role === 2) navigate("/dashboard/production");
          else if (role === 3) navigate("/dashboard/order");
          else if (role === 4) navigate("/dashboard/inventory");
          else if (role === 5) navigate("/dashboard/finance");
          else {
            navigate("/login");
            setIsLoggedIn(false);
          }
        }
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        Swal.fire({
          title: "Oops!",
          text: err.response.data.message,
          icon: "error",
        });
      } else {
        console.error(err.message);
        Swal.fire({
          title: "Oops!",
          text: err.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <>
    <CartProvider>
      <Header userInfo={null} />
    </CartProvider>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-700 px-4">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Top Toggle Buttons */}
      <div className="absolute top-8 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border border-gray-100 dark:border-gray-700 mt-14">
          <div className="flex space-x-1">
            <button
              onClick={() => setMode("customer")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                mode === "customer"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Customer Login
            </button>
            <button
              onClick={() => setMode("staff")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                mode === "staff"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Staff Login
            </button>
          </div>
        </div>

      {/* Login Card */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 w-full max-w-md transition-all duration-500 hover:shadow-3xl mt-20 mb-10">
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <img 
                src="/public/images_sadi/logoPubudu.png" 
                alt="Smart Dairy Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              {mode === "customer" ? "Welcome Back!" : "Staff Portal"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {mode === "customer"
                ? "Sign in to your Smart Dairy account"
                : "Access your staff dashboard"}
            </p>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 hover:bg-white dark:hover:bg-gray-750"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline"
            >
              <span className="flex items-center justify-center">
                Sign In
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </form>

          {/* Customer-specific content */}
          {mode === "customer" && (
            <div className="mt-8">
              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                <span className="px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Or continue with
                </span>
                <hr className="flex-grow border-gray-200 dark:border-gray-700" />
              </div>

              {/* Google Button */}
              <GoogleLoginButton className="w-full !m-0 !rounded-xl !py-3 !px-4 !font-medium hover:!shadow-md !transition-all !duration-200" />

              {/* Footer Links */}
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          )}

            {/* Footer Links */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline"
              >
                <svg
                  className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

        {/* Forgot Password Modal */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 animate-in zoom-in-95">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reset Password
                </h3>
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter your email address and we'll send you a link to reset
                  your password for your {mode} account.
                </p>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgotEmail"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
