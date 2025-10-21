import { authFetch } from "../utils/authFetchStaff";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { AuthContext } from "../../../components/AuthContext";

export default function Header({ userInfo }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/logout",
      });
      if (res.status === 200) {
        logout();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        Swal.fire({
          title: "Success",
          text: "Logged out successfully.",
          icon: "success",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error in logout:", error);
      Swal.fire({
        title: "Error",
        text: "Logout failed.",
        icon: "error",
      });
    }
  };

  return (
    <header
      className="
        fixed top-0 left-64 right-0 z-50
        bg-white dark:bg-gray-900 
        border-b border-gray-200 dark:border-gray-700 
        px-6 py-4 shadow-md
      "
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>

        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <button
            onClick={() => navigate('userProfile')}
            className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {userInfo?.profile_photo ? (
              <img
                src={userInfo.profile_photo}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="bg-gray-300 dark:bg-gray-700 rounded-full p-2">
                <User size={16} />
              </div>
            )}
            <span className="text-sm font-medium">
              Hi {userInfo?.first_name}
            </span>
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
