import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../utils/authFetchStaff";

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
          deactivationPeriod: res.data.deactivation_period || null,
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
  }

  if (!staff) {
    return <div className="p-6">Loading staff details...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Staff Details
      </h2>

      {/* Info Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">Staff Code:</span>{" "}
            {staff.staff_code}
          </p>
          <p>
            <span className="font-semibold">First Name:</span>{" "}
            {staff.first_name}
          </p>
          <p>
            <span className="font-semibold">Last Name:</span> {staff.last_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {staff.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {staff.phone}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold">Role:</span> {staff.role_name}
            <button
              onClick={() => setIsEditRoleOpen(true)}
              className="ml-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg shadow transition"
            >
              Change
            </button>
          </p>
          <button
            onClick={() => setIsEditOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition mt-4 mr-4"
          >
            ✏️ Edit Details
          </button>
          <button
            onClick={() => alert("Remove role (frontend only)")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition mt-4"
          >
            🗑️ Remove User
          </button>
        </div>

        {/* Right Side */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(staff.created_at).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(staff.updated_at).toLocaleString()}
          </p>

          {/* Active Control */}
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
                className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
              >
                <option value="default" disabled>
                  Select
                </option>
                <option value="2 minutes">1 Hour</option>
                <option value="12 hours">12 Hours</option>
                <option value="24 hours">24 Hours</option>
                <option value="7 days">7 Days</option>
              </select>
            ) : null}

            {/* Active toggle */}
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
        </div>
      </div>

      {/* Extra Admin Controls */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Controls
        </h3>
        <div className="flex flex-wrap gap-6">
          {/* Email Verified */}
          <div className="flex items-center gap-2">
            <span>Email Verified</span>
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

          {/* Phone Verified */}
          <div className="flex items-center gap-2">
            <span>Phone Verified</span>
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

          {/* 2FA Enabled */}
          <div className="flex items-center gap-2">
            <span>2FA Enabled</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={staff.is_2FA_enabled || false}
                onChange={handle2FAChange}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
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
                  onClick={(e) => setSelectedRoleId(e.target.value)}
                >
                  <option value={null}>Select</option>
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

            <form
              onSubmit={handleEditStaffDetails}
              className="space-y-3"
            >
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, first_name: e.target.value }))
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
                    setEditForm((prev) => ({ ...prev, last_name: e.target.value }))
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
