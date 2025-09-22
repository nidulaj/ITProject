import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("customer"); // "customer" or "staff"
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
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

      const { role } = res.data;

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
          else if (role === 12) navigate("/dashboard/production");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Top Toggle Buttons */}
      <div className="absolute top-6 flex space-x-4">
        <button
          onClick={() => setMode("customer")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            mode === "customer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setMode("staff")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            mode === "staff"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Staff
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 w-full max-w-md h-[620px] transition-all duration-500 flex flex-col justify-between">
        {/* Logo + Heading */}
        <div>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
              SD
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {mode === "customer" ? "Welcome Back" : "Staff Login"}
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            {mode === "customer"
              ? "Sign in to your Smart Dairy account"
              : "Sign in to the staff dashboard"}
          </p>
        </div>

        {/* Forms */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-5 flex-grow ${
            mode === "customer" ? "mt-4" : "mt-2"
          }`}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                ✉️
              </span>
              <input
                type="email"
                id="email"
                name="email"
                required
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                🔒
              </span>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                👁
              </span>
            </div>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6">
          {mode === "customer" && (
            <>
              {/* Divider */}
              <div className="flex items-center my-5">
                <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                <span className="px-2 text-gray-500 dark:text-gray-400 text-sm">
                  Or continue with
                </span>
                <hr className="flex-grow border-gray-300 dark:border-gray-700" />
              </div>

              {/* Google Button */}
              <GoogleLoginButton className="w-full !m-0 !rounded-lg !py-2 !px-4" />

              {/* Footer Links */}
              <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </>
          )}

          {/* Always visible */}
          <p className="mt-4 text-center text-sm">
            <Link to="/" className="text-blue-500 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
