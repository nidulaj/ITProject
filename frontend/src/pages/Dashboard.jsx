import { Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {authFetchCustomer} from "../features/user-management/utils/authFetchCustomer"
import DashboardHeader from "../components/DashboardHeader";
import CustomerDiscountPage from "../features/financial-management/pages/CustomerDiscountPage";
import CustomerCatalog from "../features/order-management/pages/CustomerCatalog";

import CustomerOrders from "../features/order-management/pages/CustomerOrders";

import UserProfile from "../pages/UserProfile"
import ThemeProvider from "../contexts/ThemeContext";
import NotificationProvider from "../contexts/NotificationContext";
import CustomerProvider from "../contexts/CustomerContext";
import CartSidebar from "../features/order-management/components/CartSidebar";


const FeedbackPage = () => <div>Feedback Page</div>;

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
        try {
            const res = await authFetchCustomer({
              method: "get",
              url: `http://localhost:5000/api/auth/userInfo`,
            });
            setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
   
    }, []);


  return (
    <ThemeProvider>
      <CustomerProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col">
            {/* Common Header */}
            <DashboardHeader userInfo={userInfo} />

            {/* Nested Routes */}
            <main className="flex-1 p-4">
              <Routes>
                <Route index element={<div>Welcome to your dashboard</div>} />
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
        </NotificationProvider>
      </CustomerProvider>
    </ThemeProvider>
  );
}
