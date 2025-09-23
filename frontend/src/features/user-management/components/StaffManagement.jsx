import React, { useEffect, useState, useRef } from "react";
import { authFetch } from "../utils/authFetchStaff";
import { useNavigate } from "react-router-dom";

export default function StaffManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // fetch staff list from backend
  const fetchStaffList = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/staff/auth/staffList",
      });
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/register",
        data: userData,
      });
      setIsAddUserOpen(false);
      setStaffList((prev) => [...prev, res.data]);

      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
      });
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  useEffect(() => {
    fetchStaffList();

    const fetchUserRoles = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: "http://localhost:5000/api/user-roles/getAllRoles",
        });
        setUserRoles(res.data);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };

    fetchUserRoles();
  }, []);


  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative z-0">
      <h2 className="text-lg font-bold mb-4">Staff Management</h2>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search by name/email"
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        <select className="w-40 px-3 py-2 border rounded-lg dark:bg-gray-700">
          <option>All Users</option>
          <option>Active</option>
          <option>Deactive</option>
        </select>

        <button
          className="w-32 bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddUserOpen(true)}
        >
          Add User
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 text-left">Staff ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((user) => (
            <tr
              key={user.staff_id}
              onClick={() => navigate(`${user.staff_id}`)}
              className="border-t"
            >
              <td className="p-2">{user.staff_code}</td>
              <td className="p-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone}</td>
              <td className="p-2">{user.role_name}</td>
              <td
                className={`p-2 ${
                  user.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </td>
              <td className="p-2 space-x-2">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                {user.is_active ? (
                  <button className="px-2 py-1 bg-red-600 text-white rounded">
                    Disable
                  </button>
                ) : (
                  <button className="px-2 py-1 bg-green-600 text-white rounded">
                    Enable
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Popup */}
      {isAddUserOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div
            className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative"
          >
            {/* Close button */}
            <button
              onClick={() => setIsAddUserOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✖
            </button>

            <h2 className="text-lg font-bold mb-4 text-center">
              Add New Staff User
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                onChange={handleChange}
                value={userData.firstName}
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <input
                onChange={handleChange}
                value={userData.lastName}
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <input
                onChange={handleChange}
                value={userData.email}
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <input
                onChange={handleChange}
                value={userData.phone}
                type="text"
                name="phone"
                placeholder="Phone"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <select
                name="role"
                value={userData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              >
                <option value="">Select Role</option>
                {userRoles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add New Staff
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
