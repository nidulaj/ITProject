import { authFetch } from "../../user-management/utils/authFetchStaff";
import { User } from "lucide-react";

export default function Header({ userInfo, setActiveTab }) {
  const handleLogout = async () => {
    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/logout",
      });
      if (res.status === 200) {
        localStorage.removeItem("isLoggedIn");
        // If you want to redirect after logout, you can still use window.location
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error log out:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>

        <div className="flex items-center space-x-4">
          {/* User Profile trigger */}
          <button
            onClick={() => setActiveTab("User Profile")} // ✅ switch tab
            className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="bg-gray-300 dark:bg-gray-700 rounded-full p-2">
              <User size={16} />
            </div>
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
