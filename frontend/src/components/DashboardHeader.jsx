import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authFetchCustomer } from "../features/user-management/utils/authFetchCustomer";

export default function DashboardHeader({ userInfo }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await authFetchCustomer({
        method: "post",
        url: `http://localhost:5000/api/auth/logout`,
      });
      navigate("/login");
      console.log(res.data.message);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      {/* Full-width flex container without side margins */}
      <div className="w-full flex items-center justify-between py-3 px-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-blue-600 font-bold text-xl">Smart Dairy</span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link
            to="/dashboard/products"
            className="text-gray-700 hover:text-blue-600"
          >
            Products
          </Link>
          <Link
            to="/dashboard/orders"
            className="text-gray-700 hover:text-blue-600"
          >
            Orders
          </Link>
          <Link
            to="/dashboard/feedback"
            className="text-gray-700 hover:text-blue-600"
          >
            Feedback
          </Link>
          <Link
            to="/dashboard/discounts"
            className="text-gray-700 hover:text-blue-600"
          >
            Discounts
          </Link>
        </nav>

        {/* Right: User + Logout */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("userProfile")}
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
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
