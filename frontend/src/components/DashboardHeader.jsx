import { Link, useLocation } from "react-router-dom";
import { User, LogOut, ShoppingCart, Home, Package, FileText, Tag } from "lucide-react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authFetchCustomer } from "../features/user-management/utils/authFetchCustomer";
import { AuthContext } from "./AuthContext";
import NotificationIcon from "./NotificationIcon";
import CartSidebar from "../features/order-management/components/CartSidebar";
import { useCart } from "../contexts/CartContext";

export default function DashboardHeader({ userInfo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const {
    cart,
    getCartItemCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Debug userInfo
  console.log("DashboardHeader userInfo:", userInfo);

  // Function to determine if a link is active
  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      console.log("Logout initiated...");
      const res = await authFetchCustomer({
        method: "post",
        url: `http://localhost:5000/api/auth/logout`,
      });
      console.log("Logout response:", res.data);
      logout();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      navigate("/");
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err);
      if (err.response) {
        console.log("Logout error response:", err.response.data.message);
      } else {
        console.error("Logout error:", err.message);
      }
      // Even if logout fails, clear local storage and redirect
      logout();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
      {/* Full-width flex container without side margins */}
      <div className="w-full flex items-center justify-between py-4 px-6">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src="/public/images_sadi/logoPubudu.png" 
            alt="Smart Dairy Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-blue-600 font-bold text-2xl tracking-tight">Smart Dairy</span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to={userInfo ? "/dashboard" : "/"}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard/products"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/products")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Products</span>
          </Link>
          <Link
            to="/dashboard/orders"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/orders")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Orders</span>
          </Link>
          <Link
            to="/dashboard/discounts"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/discounts")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Discounts</span>
          </Link>
        </nav>

        {/* Right: Notifications + Cart + User + Logout */}
        {userInfo ? (
          <div className="flex items-center space-x-3">
            {/* Notification Icon */}
            <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <NotificationIcon customerId={userInfo?.cus_id || userInfo?.customer_id || 1} />
            </div>
            
            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {getCartItemCount()}
                </span>
              )}
            </button>
            
            {/* User Profile */}
            <button
              onClick={() => {
                console.log("Navigating to user profile, userInfo:", userInfo);
                navigate("/dashboard/userProfile");
              }}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              title={
                userInfo
                  ? `Profile for ${userInfo.first_name || userInfo.name}`
                  : "Profile - User info not loaded"
              }
            >
              {userInfo?.profile_photo ? (
                <img
                  src={userInfo.profile_photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 transition-colors"
                />
              ) : (
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-2 group-hover:from-blue-500 group-hover:to-blue-700 transition-all">
                  <User size={16} className="text-white" />
                </div>
              )}
              <span className="text-sm font-medium">
                Hi, {userInfo?.first_name || userInfo?.name || "User"}
              </span>
            </button>
            
            {/* Logout Button */}
            <button
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
            
            <CartSidebar
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cart={cart}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={() => {
                // Handle checkout logic here
                console.log("Checkout initiated");
              }}
              total={getCartTotal()}
            />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 dark:text-blue-400 font-medium px-5 py-2 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}