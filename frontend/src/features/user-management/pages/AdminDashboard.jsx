import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Slidebar";
import Header from "../components/Header";
import StaffManagement from "../components/StaffManagement";
import RolesAccess from "../components/RoleAccess";
import LogsMonitoring from "../components/LogsMonitoring";
import Complaints from "../components/Complaints";
import Chat from "../components/Chat";
import ProfileSecurity from "../components/ProfileSecurity";
import RoleInfo from "../components/RoleInfo";
import StaffUserInfo from "../components/staffUserInfo";
import CustomerManagement from "../components/customerManagement";
import UserProfile from "../components/UserProfile";
import CustomerInfo from "../components/CustomerInfo";
import { authFetch } from "../utils/authFetchStaff";

export default function AdminDashboard() {
  const [userInfo, setUserInfo] = useState(null);


  useEffect(() => {
      const fetchUserInfo = async () => {
      try {
          const res = await authFetch({
            method: "get",
            url: `http://localhost:5000/api/staff/auth/userInfo`,
          });
          setUserInfo(res.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  fetchUserInfo();
 
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 space-y-8 overflow-y-auto ml-64">
        <Header userInfo={userInfo} />
        <Routes>
          <Route path="/" element={<h2 className="text-lg font-bold">Welcome to Admin Dashboard</h2>} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="staff/:staffId" element={<StaffUserInfo />} />
          <Route path="customers/:customerId" element={<CustomerInfo />} />
          <Route path="rolesAccess" element={<RolesAccess />} />
          <Route path="rolesAccess/:roleId" element={<RoleInfo />} />
          <Route path="logsMonitoring" element={<LogsMonitoring />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profileSecurity" element={<ProfileSecurity />} />
          <Route path="userProfile" element={<UserProfile />} />
        </Routes>
      </main>
    </div>
  );
}
