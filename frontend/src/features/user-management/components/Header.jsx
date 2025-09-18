import { authFetch } from "../utils/authFetchStaff";
import React from "react";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/logout",
      });
      if (res.status === 200) {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
