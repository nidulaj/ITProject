import { Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { authFetch } from "../utils/authFetchStaff";

import Sidebar from "../components/Slidebar";
import Header from "../components/Header";
import LoadingScreen from "../../../components/LoadingScreen";

const StaffManagement = lazy(() => import("../components/StaffManagement"));
const RolesAccess = lazy(() => import("../components/RoleAccess"));
const LogsMonitoring = lazy(() => import("../components/LogsMonitoring"));
const Complaints = lazy(() => import("../components/Complaints"));
const Chat = lazy(() => import("../components/Chat"));
const ProfileSecurity = lazy(() => import("../components/ProfileSecurity"));
const RoleInfo = lazy(() => import("../components/RoleInfo"));
const StaffUserInfo = lazy(() => import("../components/staffUserInfo"));
const CustomerManagement = lazy(() => import("../components/customerManagement"));
const UserProfile = lazy(() => import("../components/UserProfile"));
const CustomerInfo = lazy(() => import("../components/CustomerInfo"));
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
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route
              path="/"
              element={
                <h2 className="text-lg font-bold">
                  Welcome to Admin Dashboard
                </h2>
              }
            />
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
        </Suspense>
      </main>
    </div>
  );
}
