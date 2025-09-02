import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react"; // icons

export default function DashboardHeader() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      {/* Full-width flex container without side margins */}
      <div className="w-full flex items-center justify-between py-3 px-4">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-blue-600 font-bold text-xl">
            Smart Dairy
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Products
          </Link>
          <Link
            to="/orders"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Orders
          </Link>
          <Link
            to="/feedback"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Feedback
          </Link>
          <Link
            to="/support"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Support
          </Link>
        </nav>

        {/* Right: User + Logout */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              Hi, User
            </span>
          </div>
          <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
