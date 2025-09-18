import React, { useState } from "react";
import Sidebar from "../components/Slidebar";
import Header from "../components/Header";
import UserManagement from "../components/UserManagement";
import RolesAccess from "../components/RoleAccess";
import LogsMonitoring from "../components/LogsMonitoring";
import Complaints from "../components/Complaints";
import Chat from "../components/Chat";
import ProfileSecurity from "../components/ProfileSecurity";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "userManagement":
        return <UserManagement />;
      case "rolesAccess":
        return <RolesAccess />;
      case "logsMonitoring":
        return <LogsMonitoring />;
      case "complaints":
        return <Complaints />;
      case "chat":
        return <Chat />;
      case "profileSecurity":
        return <ProfileSecurity />;
      default:
        return (
          <h2 className="text-lg font-bold">Welcome to Admin Dashboard</h2>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar - Fixed */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8 overflow-y-auto ml-64">
        <Header />
        {renderContent()}
      </main>
    </div>
  );
}
