import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";

export default function RoleInfo() {
  const { roleId } = useParams();
  const [role, setRole] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 👇 One state for both role_name & description
  const [editForm, setEditForm] = useState({
    role_name: "",
    description: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/user-roles/updateRole/${roleId}`,
        data: editForm, // send object with role_name & description
      });
      setRole(res.data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/user-roles/getRoleById/${roleId}`,
        });
        setRole(res.data);
        setEditForm({
          role_name: res.data.role_name,
          description: res.data.description,
        });
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    const fetchStaff = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/staff/auth/staffInfo/${roleId}`,
        });
        setStaffMembers(res.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchRole();
    fetchStaff();
  }, [roleId]);

  if (!role) {
    return <p>Loading role details...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      {/* Role Details */}
      <div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          Role Details
        </h2>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">Role ID:</span> {role.role_id}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {role.role_name}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {role.description}
          </p>
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(role.created_at).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            ✏️ Edit Role
          </button>
          <button
            onClick={() => alert("Remove role (frontend only)")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            🗑️ Remove Role
          </button>
        </div>
      </div>

      {/* Staff Members */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Staff Members
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {staff.first_name} {staff.last_name}
              </h4>
              <p
                className={`text-sm font-medium ${
                  staff.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {staff.is_active ? "Active" : "Inactive"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {staff.email}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Role Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Role
            </h2>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role Name
                </label>
                <input
                  type="text"
                  value={editForm.role_name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role_name: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  rows="3"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
