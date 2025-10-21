import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";
import { useNavigate } from "react-router-dom";

export default function RoleInfo() {
  const { roleId } = useParams();
  const [role, setRole] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    role_name: "",
    description: "",
  });

  // Handler for role name - allows letters, spaces, and common special characters for role names
  const handleRoleNameChange = (e) => {
    const { value } = e.target;
    // Allow letters, spaces, hyphens, underscores, and parentheses
    const filteredValue = value.replace(/[^A-Za-z\s\-_()]/g, "");
    setEditForm((prev) => ({ ...prev, role_name: filteredValue }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/user-roles/updateRole/${roleId}`,
        data: editForm,
      });
      setRole(res.data);
      setIsEditOpen(false);
      Swal.fire({
        title: "Success",
        text: "Role updated successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update role.",
        icon: "error",
      });
    }
  };

    const handleDelete = async (roleId) => {
    try {
      await authFetch({
        method: "delete",
        url: "http://localhost:5000/api/user-roles/deleteRole",
        data: { roleId },
      });
      setUserRoles((prev) => prev.filter((role) => role.role_id !== roleId));
      Swal.fire({
        title: "Success",
        text: "Role deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete role.",
        icon: "error",
      });
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
            onClick={() => handleDelete(roleId)}
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
              onClick={() => navigate(`/dashboard/admin/staff/${staff.staff_id}`)}
              key={staff.staff_id}
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
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative mx-4">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Role
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update role name and description
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Role Name
                </label>
                <input
                  type="text"
                  value={editForm.role_name}
                  onChange={handleRoleNameChange}
                  required
                  placeholder="e.g., Administrator, Manager"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Letters, spaces, hyphens, and underscores only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                  required
                  placeholder="Describe the responsibilities and permissions..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="4"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {editForm.description.length} characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
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