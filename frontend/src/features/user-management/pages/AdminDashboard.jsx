import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Slidebar";
import Header from "../components/Header";
import StaffManagement from "../components/StaffManagement";
import RolesAccess from "../components/RoleAccess";
import LogsMonitoring from "../components/LogsMonitoring";
import Complaints from "../components/Complaints";
import Chat from "../components/Chat";
import ProfileSecurity from "../components/ProfileSecurity";
import AddStaff from "../components/AddStaff";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 space-y-8 overflow-y-auto ml-64">
        <Header />
        <Routes>
          <Route path="/" element={<h2 className="text-lg font-bold">Welcome to Admin Dashboard</h2>} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="staff/add" element={<AddStaff />} />
          <Route path="rolesAccess" element={<RolesAccess />} />
          <Route path="logsMonitoring" element={<LogsMonitoring />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profileSecurity" element={<ProfileSecurity />} />
        </Routes>
      </main>
    </div>
  );
}
