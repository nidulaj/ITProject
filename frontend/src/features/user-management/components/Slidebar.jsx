import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard/admin", label: "Dashboard" },
    { key: "/dashboard/admin/staff", label: "Staff Management" },
    { key: "/dashboard/admin/rolesAccess", label: "Roles & Access" },
    { key: "/dashboard/admin/logsMonitoring", label: "Logs & Monitoring" },
    { key: "/dashboard/admin/complaints", label: "Complaints" },
    { key: "/dashboard/admin/chat", label: "Chat" },
    { key: "/dashboard/admin/profileSecurity", label: "Profile & Security" },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-6 font-bold text-2xl text-blue-600">Smart Dairy</div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.key}
            className={`block px-3 py-2 rounded-lg ${
              location.pathname === item.key
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
