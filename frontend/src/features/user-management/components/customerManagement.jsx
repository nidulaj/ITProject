import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";
import { useNavigate } from "react-router-dom";
export default function customerManagement() {
  const [customerList, setCustomerList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: "http://localhost:5000/api/auth/allCustomers",
        });
        setCustomerList(res.data);
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };

    fetchCustomerList();
  }, []);


  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Customer Management</h2>
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

      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 text-left">Customer ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Statues</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((user) => (
            <tr
              key={user.cus_id}
              onClick={() => navigate(`${user.cus_id}`)}
              className="border-t"
            >
              <td className="p-2">{user.customer_code}</td>
              <td className="p-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone}</td>
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
    </section>
  );
}
