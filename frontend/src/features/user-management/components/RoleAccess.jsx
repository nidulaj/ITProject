import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";
export default function RolesAccess() {
  const [userRoles, setUserRoles] = useState([]);
  const [newRole, setNewRole] = useState({ role_name: "",
  description: ""})

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await authFetch({
      method: "post",
      url: "http://localhost:5000/api/user-roles/createRole",
      data: newRole,
    });
    if (res.status === 201) {
      setUserRoles((prev) => [...prev, res.data]);
      setNewRole({ role_name: "", description: "" });
    }
  } catch (error) {
    console.error("Error creating role:", error);
  }
};
  return (
    <>
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">User Roles</h2>
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Search by name/email"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />

          <button className="w-40 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Add User Role
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 text-left">User Role ID</th>
              <th className="p-2 text-left">Role Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Created Date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {userRoles.map((role) => (
              <tr key={role.role_id} className="border-t">
                <td className="p-2">{role.role_id}</td>
                <td className="p-2">{role.role_name}</td>
                <td className="p-2">{role.description}</td>
                <td className="p-2">{new Date(role.created_at).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded">
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="w-1/2 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 text-center">
          Add new User Role
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            name="role_name"
            placeholder="Role Name"
            value={newRole.role_name}
            className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <input
            onChange={handleChange}
            type="text"
            name="description"
            placeholder="Description"
            value={newRole.description}
            className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <button
            type="submit"
            className="w-3/4 mx-auto block bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Role
          </button>
        </form>
      </section>
    </>
  );
}
