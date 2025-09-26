import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../utils/authFetchStaff";
import { useNavigate } from "react-router-dom";

export default function staffUserInfo() {
  const { staffId } = useParams();
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [staff, setStaff] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(null);
  const [accountStatus, setAccountStatus] = useState({
    isActive: null,
    deactivationPeriod: "default",
  });
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/staff/auth/staffDetails/${staffId}`,
        });
        setStaff(res.data);

        setAccountStatus({
          isActive: res.data.is_active,
          deactivationPeriod: res.data.deactivated_until || null,
        });

        setEditForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone: res.data.phone,
        });
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/user-roles/getAllRoles`,
        });
        setRoles(
          res.data.map((role) => ({ id: role.role_id, name: role.role_name }))
        );
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchStaff();
    fetchRoles();
  }, [staffId]);

  const handleRoleChange = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) return;

    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/changeRole/${staffId}`,
        data: { roleId: selectedRoleId },
      });
      setIsEditRoleOpen(false);
      setStaff(res.data);
      setSelectedRoleId(null);
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleChangeAccountStatus = async (e) => {
    e.preventDefault();
    const willBeActive = e.target.checked;

    if (
      !willBeActive &&
      (!accountStatus.deactivationPeriod ||
        accountStatus.deactivationPeriod === "default")
    ) {
      alert("Please select a valid deactivation period.");
      return;
    }
    const newStatus = {
      ...accountStatus,
      isActive: willBeActive,
      deactivationPeriod: willBeActive
        ? null
        : accountStatus.deactivationPeriod,
    };

    setAccountStatus(newStatus);
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/changeAccountStatus/${staffId}`,
        data: newStatus,
      });
      setStaff(res.data);
    } catch (error) {
      console.error("Error changing account status:", error);
    }
  };

  const handle2FAChange = async (e) => {
    const isEnabled = e.target.checked;
    setIs2FAEnabled(isEnabled);

    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/change2FA/${staffId}`,
        data: { is2FAEnabled: isEnabled },
      });
      setStaff(res.data);
    } catch (error) {
      console.error("Error changing 2FA setting:", error);
    }
  };

  const handleEditStaffDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/changeStaffDetails/${staffId}`,
        data: editForm,
      });
      setStaff(res.data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error editing staff details:", error);
    }
  };

  const handleRemoveUser = async () => {
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/removeStaff/${staffId}`,
      });
      navigate("/dashboard/admin/staff");
    } catch (error) {
      console.error("Error removing staff member:", error);
    }
  };

  if (!staff) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 dark:text-gray-300">Loading staff details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Staff Details
        </h2>
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            staff.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {staff.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Profile Photo and Basic Info Section */}
      <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Profile Photo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <img
              src={staff.profile_photo || "/src/assets/default-user-icon.png"}
              alt="Staff Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-lg"
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {staff.first_name} {staff.last_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {staff.role_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Staff ID: {staff.staff_code}
            </p>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">Contact Information</span>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Email:</span> 
                  {staff.email}
                  {staff.is_email_verified ? (
                    <span className="text-green-500 text-xs">✓ Verified</span>
                  ) : (
                    <span className="text-red-500 text-xs">✗ Not Verified</span>
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span> 
                  {staff.phone}
                  {staff.is_phone_verified ? (
                    <span className="text-green-500 text-xs">✓ Verified</span>
                  ) : (
                    <span className="text-red-500 text-xs">✗ Not Verified</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">Role Management</span>
              <div className="flex items-center gap-3">
                <span className="text-sm">{staff.role_name}</span>
                <button
                  onClick={() => setIsEditRoleOpen(true)}
                  disabled={!staff.is_active && staff.deactivated_until === null}
                  className={`text-sm px-3 py-1 rounded-lg shadow transition text-white
                    ${
                      !staff.is_active && staff.deactivated_until === null
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }
                  `}
                >
                  Change Role
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">Account Timeline</span>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(staff.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(staff.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">Account Status</span>
              <div className="flex items-center gap-3">
                {accountStatus.isActive ? (
                  <select
                    value={accountStatus.deactivationPeriod || "default"}
                    onChange={(e) =>
                      setAccountStatus((prev) => ({
                        ...prev,
                        deactivationPeriod: e.target.value,
                      }))
                    }
                    className="border rounded-lg px-3 py-2 dark:bg-gray-600 dark:text-white text-sm"
                  >
                    <option value="default" disabled>
                      Select deactivation period
                    </option>
                    <option value="2 minutes">1 Hour</option>
                    <option value="12 hours">12 Hours</option>
                    <option value="24 hours">24 Hours</option>
                    <option value="7 days">7 Days</option>
                  </select>
                ) : null}

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={accountStatus.isActive ?? false}
                    onChange={handleChangeAccountStatus}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    Active
                  </span>
                </label>
              </div>
              {/* Show when disabled temporarily */}
              {!accountStatus.isActive && staff.deactivated_until && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Account will be active on:{" "}
                  {new Date(staff.deactivated_until).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsEditOpen(true)}
          disabled={!staff.is_active && staff.deactivated_until === null}
          className={`px-4 py-2 rounded-lg shadow transition text-white 
            ${
              !staff.is_active && staff.deactivated_until === null
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          ✏️ Edit Details
        </button>

        <button
          onClick={handleRemoveUser}
          disabled={!staff.is_active && staff.deactivated_until === null}
          className={`px-4 py-2 rounded-lg text-white shadow transition
            ${
              !staff.is_active && staff.deactivated_until === null
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }
          `}
        >
          🗑️ Remove User
        </button>
      </div>

      {/* Security Settings */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Security & Verification Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Verified */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">Email Verified</span>
              <label className="flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!staff.is_email_verified}
                  disabled
                />
                <div
                  className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:after:translate-x-full"
                ></div>
              </label>
            </div>
          </div>

          {/* Phone Verified */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">Phone Verified</span>
              <label className="flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!staff.is_phone_verified}
                  disabled
                />
                <div
                  className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:after:translate-x-full"
                ></div>
              </label>
            </div>
          </div>

          {/* 2FA Enabled */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">2FA Enabled</span>
              <label
                className={`flex items-center ${
                  !staff.is_active && staff.deactivated_until === null
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={staff.is_2FA_enabled || false}
                  onChange={handle2FAChange}
                  disabled={!staff.is_active && staff.deactivated_until === null}
                />
                <div
                  className={`w-11 h-6 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                    peer-checked:after:translate-x-full
                    ${
                      !staff.is_active && staff.deactivated_until === null
                        ? "bg-gray-300"
                        : "bg-gray-200 peer-checked:bg-green-500"
                    }`}
                ></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {isEditRoleOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Role
            </h2>

            <form
              onSubmit={(e) => handleRoleChange(e, selectedRoleId)}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select New Role
                </label>
                <select
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  value={selectedRoleId || ""}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditRoleOpen(false)}
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

      {/* Edit Details Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Staff Details
            </h2>

            <form onSubmit={handleEditStaffDetails} className="space-y-3">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
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