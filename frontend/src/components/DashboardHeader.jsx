import { Link, useLocation } from "react-router-dom";
import { User, LogOut, ShoppingCart } from "lucide-react";
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
  const { cart, getCartItemCount, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Debug userInfo
  console.log("DashboardHeader userInfo:", userInfo);

  // Function to determine if a link is active
  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
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
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      {/* Full-width flex container without side margins */}
      <div className="w-full flex items-center justify-between py-3 px-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-blue-600 font-bold text-xl">Smart Dairy</span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link 
            to="/dashboard" 
            className={`transition-colors duration-200 ${
              isActive("/dashboard") 
                ? "text-blue-600" 
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard/products"
            className={`transition-colors duration-200 ${
              isActive("/dashboard/products") 
                ? "text-blue-600" 
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Products
          </Link>
          <Link
            to="/dashboard/orders"
            className={`transition-colors duration-200 ${
              isActive("/dashboard/orders") 
                ? "text-blue-600" 
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Orders
          </Link>
          <Link
            to="/dashboard/feedback"
            className={`transition-colors duration-200 ${
              isActive("/dashboard/feedback") 
                ? "text-blue-600" 
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Feedback
          </Link>
          <Link
            to="/dashboard/discounts"
            className={`transition-colors duration-200 ${
              isActive("/dashboard/discounts") 
                ? "text-blue-600" 
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Discounts
          </Link>
        </nav>

        {/* Right: Notifications + Cart + User + Logout */}
          {userInfo ? <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <NotificationIcon customerId={1} />
          
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
            className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title={userInfo ? `Profile for ${userInfo.first_name || userInfo.name}` : "Profile - User info not loaded"}
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
              Hi {userInfo?.first_name || userInfo?.name || "User"}
            </span>
          </button>
          
          {/* Logout Button */}
          <button
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>  <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={() => {
          // Handle checkout logic here
          console.log('Checkout initiated');
        }}
        total={getCartTotal()}
      />
        </div> : <div className="flex items-center space-x-3">
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
            </div>}
      </div>
      
      {/* Cart Sidebar */}
     
    </header>
  );
}
