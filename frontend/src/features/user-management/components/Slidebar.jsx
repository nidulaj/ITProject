export default function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "staffManagement", label: "Staff Management" },
    { key: "rolesAccess", label: "Roles & Access" },
    { key: "logsMonitoring", label: "Logs & Monitoring" },
    { key: "complaints", label: "Complaints" },
    { key: "chat", label: "Chat" },
    { key: "profileSecurity", label: "Profile & Security" },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-6 font-bold text-2xl text-blue-600">Smart Dairy</div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveMenu(item.key)}
            className={`w-full text-left block px-3 py-2 rounded-lg ${
              activeMenu === item.key
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
