import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../components/AuthContext";
import Header from "../../../components/DashboardHeader";
import { CartProvider } from "../../../contexts/CartContext";

export default function Verify2FA() {
  const location = useLocation();
  const { role, type } = location.state || {};
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mode] = useState(type === "staff" ? "staff" : "customer");

  useEffect(() => {
    if (timeLeft === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        mode === "customer"
          ? "http://localhost:5000/api/auth/verify-2fa"
          : "http://localhost:5000/api/staff/auth/verify2FA";

      const res = await axios.post(
        endpoint,
        { code },
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(true);
      const { role, user: loggedInUser } = res.data;
      setUser(loggedInUser);
      console.log("Logged in user:", loggedInUser);

      if (!role) {
        // no role → customer
        navigate("/dashboard");
      } else {
        setIsLoggedIn(true);
        if (!role) {
          navigate("/dashboard");
        } else {
          if (role === 1) navigate("/dashboard/admin");
          else if (role === 12) navigate("/dashboard/production");
          else if (role === 9) navigate("/dashboard/order");
          else if (role === 11) navigate("/dashboard/inventory");
          else if (role === 13) navigate("/dashboard/finance");
          else {
            navigate("/login");
            setIsLoggedIn(false);
          }
        }
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/resend-2fa",
        {},
        { withCredentials: true }
      );
      console.log("Resend 2FA code");
      setTimeLeft(60);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      } else {
        console.error(err.message);
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

        {/* Verification Card */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 w-full max-w-md transition-all duration-500 hover:shadow-3xl mt-20">
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
            </div>

            {/* Security Shield Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Enter the verification code sent to your {mode === "staff" ? "staff " : ""}email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Verification Code Input */}
            <div className="space-y-2">
              <label
                htmlFor="verificationCode"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Verification Code
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  required
                  onChange={(e) => setCode(Number(e.target.value))}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 hover:bg-white dark:hover:bg-gray-750 text-center text-lg tracking-widest font-semibold"
                />
              </div>
            </div>

            {/* Timer Display */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {timeLeft > 0 ? (
                    <>Code expires in <span className="font-bold">{timeLeft}s</span></>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Code expired - request a new one</span>
                  )}
                </p>
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
            >
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verify & Continue
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-200 dark:border-gray-700" />
              <span className="px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                Didn't receive the code?
              </span>
              <hr className="flex-grow border-gray-200 dark:border-gray-700" />
            </div>

            {/* Resend Button */}
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`w-full border-2 rounded-xl py-3.5 font-semibold transition-all duration-200 ${
                timeLeft > 0
                  ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50"
                  : "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transform hover:scale-[1.02]"
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resend Verification Code
              </span>
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <svg className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center max-w-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For security purposes, this code will expire after use. If you need assistance, please contact support.
          </p>
        </div>
      </div>
    </>
  );
}