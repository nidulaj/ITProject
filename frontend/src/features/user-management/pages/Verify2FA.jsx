import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../components/AuthContext";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Verify 2FA
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Enter the 2FA code sent to your email/phone
        </p>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          {/* Verification Code Input */}
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Enter 2FA Code
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                required
                onChange={(e) => setCode(Number(e.target.value))}
                placeholder="123456"
                className="w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Verify
          </button>

          {/* Timer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Resend code again in: {timeLeft}s</p>
          </div>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`w-full border border-gray-300 dark:border-gray-700 rounded-lg py-2 mt-2 transition 
          ${
            timeLeft > 0
              ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
              : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
          >
            Resend Verification Code
          </button>
        </form>
      </div>
    </div>
  );
}
