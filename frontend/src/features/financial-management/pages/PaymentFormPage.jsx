import React, { useState, useEffect } from "react";
import PaymentForm from "../components/PaymentForm";
import NotificationProvider from "../../../contexts/NotificationContext";
import NotificationDisplay from "../../../components/NotificationDisplay";
import CustomerHeader from "../../../components/CustomerHeader";
import { authFetchCustomer } from "../../user-management/utils/authFetchCustomer";

const PaymentFormPage = ({ onUpdateStats }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetchCustomer({
          method: "get",
          url: "http://localhost:5000/api/auth/userInfo",
        });
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <CustomerHeader userInfo={userInfo} title="Complete Your Payment" />
        <div className="flex items-center justify-center p-6">
          <NotificationDisplay />
          <PaymentForm onUpdateStats={onUpdateStats} />
        </div>
      </div>
    </NotificationProvider>
  );
};

export default PaymentFormPage;
