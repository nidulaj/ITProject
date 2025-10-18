import { Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {authFetchCustomer} from "../features/user-management/utils/authFetchCustomer"
import DashboardHeader from "../components/DashboardHeader";
import CustomerDiscountPage from "../features/financial-management/pages/CustomerDiscountPage";
import CustomerCatalog from "../features/order-management/pages/CustomerCatalog";

import CustomerOrders from "../features/order-management/pages/CustomerOrders";
import PubuduHomepage from "../features/production-management/pages/PubuduHomePage";
import UserProfile from "../pages/UserProfile"
import ThemeProvider from "../contexts/ThemeContext";
import NotificationProvider from "../contexts/NotificationContext";
import CustomerProvider from "../contexts/CustomerContext";
import { CartProvider } from "../contexts/CartContext";
import CartSidebar from "../features/order-management/components/CartSidebar";
import NotificationDisplay from "../components/NotificationDisplay";


const FeedbackPage = () => <div>Feedback Page</div>;

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoadingUserInfo(true);
        console.log("Fetching user info...");
        const res = await authFetchCustomer({
          method: "get",
          url: `http://localhost:5000/api/auth/userInfo`,
        });
        console.log("User info response:", res.data);
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        // If user info fetch fails, try to get from localStorage as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserInfo(parsedUser);
            console.log("Using stored user info:", parsedUser);
          } catch (parseError) {
            console.error("Error parsing stored user:", parseError);
          }
        }
      } finally {
        setIsLoadingUserInfo(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Add a function to refresh user info
  const refreshUserInfo = async () => {
    try {
      const res = await authFetchCustomer({
        method: "get",
        url: `http://localhost:5000/api/auth/userInfo`,
      });
      setUserInfo(res.data);
      console.log("User info refreshed:", res.data);
    } catch (error) {
      console.error("Error refreshing user info:", error);
    }
  };


  return (
    <ThemeProvider>
      <CustomerProvider>
        <NotificationProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {/* Common Header */}
              <DashboardHeader userInfo={userInfo} />

              {/* Notification Display */}
              <NotificationDisplay />

              {/* Nested Routes */}
              <main className="flex-1 p-4">
                <Routes>
                  <Route index element={<div className="-m-4"><PubuduHomepage hideHeader={true} userInfo={userInfo} /></div>} />
                  <Route path="products" element={<CustomerCatalog />} />
                  <Route path="products/cart" element={<CartSidebar />} />
                  <Route path="discounts" element={<CustomerDiscountPage />} />
                  <Route path="orders" element={<CustomerOrders />} />
                  <Route path="feedback" element={<FeedbackPage />} />
                  <Route path="userProfile" element={<UserProfile />} />
                </Routes>

                {/* If you need further nested routing inside each page */}
                <Outlet />
              </main>
            </div>
          </CartProvider>
        </NotificationProvider>
      </CustomerProvider>
    </ThemeProvider>
  );
}
