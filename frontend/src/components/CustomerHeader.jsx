import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { authFetchCustomer } from "../features/user-management/utils/authFetchCustomer";

export default function CustomerHeader({ userInfo }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await authFetchCustomer({
        method: "post",
        url: "http://localhost:5000/api/auth/logout",
      });
      if (res.status === 200) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("customerToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-blue-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side (Title / Logo) */}
        <div className="flex items-center space-x-4">
          <img src="/public/images_sadi/logoPubudu.png" alt="" className="h-12 w-12 object-contain" />
          <h1 className="text-2xl font-bold text-blue-600">Smart Dairy</h1>
        </div>

        {/* Right side (User or Auth buttons) */}
        <div className="flex items-center space-x-4">
          {userInfo ? (
            // ===== Logged-in view =====
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate("/dashboard/userProfile")} 
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {userInfo?.profile_photo ? (
                  <img
                    src={userInfo.profile_photo}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="bg-blue-100 rounded-full p-2">
                    <User size={16} className="text-blue-600" />
                  </div>
                )}
                <span className="text-sm font-medium">
                  Hi {userInfo?.first_name || userInfo?.name || "User"}
                </span>
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            // ===== Logged-out view =====
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium px-4 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}