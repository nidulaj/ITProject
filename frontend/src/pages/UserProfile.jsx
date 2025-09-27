import { useState, useEffect } from "react";
import { authFetchCustomer } from "../features/user-management/utils/authFetchCustomer";

export default function UserProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetchCustomer({
          method: "get",
          url: `http://localhost:5000/api/auth/userInfo`,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleEditProfile = (e) => {
    e.preventDefault();
    const res = authFetchCustomer({
      method: "put",
      url: `http://localhost:5000/api/auth/updateUserDetails`,
      data: editForm,
    });
    console.log("Updating profile:", editForm);
    setUser((prev) => ({ ...prev, ...editForm }));
    setIsEditOpen(false);
  };

  const handleChangePassword = (e) => {
    if (e) e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New passwords don't match!");
      return;
    }

    try {
      const res = authFetchCustomer({
        method: "put",
        url: `http://localhost:5000/api/auth/updatePassword`,
        data: {
          currentPassword: passwordForm.current_password,
          newPassword: passwordForm.new_password,
        },
      });

      console.log(res.data)

      setIsChangePasswordOpen(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handle2FAChange = async (e) => {
    const isEnabled = e.target.checked;
    setIs2FAEnabled(isEnabled);

    try {
      const res = await authFetchCustomer({
        method: "put",
        url: `http://localhost:5000/api/auth/change2FA`,
        data: { is2FAEnabled: isEnabled },
      });
      setUser((prev) => ({ ...prev, is_2FA_enabled: isEnabled }));
    } catch (error) {
      console.error("Error changing 2FA setting:", error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    console.log("File received:", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await authFetchCustomer({
        method: "post",
        url: "http://localhost:5000/api/auth/uploadProfilePhoto",
        data: formData,
      });

      setUser((prev) => ({
        ...prev,
        profile_photo: res.data.photoUrl,
      }));
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handlePhotoRemove = async () => {
    try {
      const res = await authFetchCustomer({
        method: "delete",
        url: "http://localhost:5000/api/auth/removeProfilePhoto",
      });

      setUser((prev) => ({
        ...prev,
        profile_photo: null,
      }));
    } catch (error) {
      console.error("Error removing photo:", error);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        My Profile
      </h2>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-4 py-6">
        <div className="relative">
          <img
            src={user.profile_photo || "/src/assets/default-user-icon.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
          {user.profile_photo && (
            <button
              onClick={handlePhotoRemove}
              className="absolute bottom-0 left-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition"
              title="Remove profile photo"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the camera icon to change your profile photo
          </p>
          {user.profile_photo && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Click the trash icon to remove it
            </p>
          )}
        </div>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">Customer ID:</span>
            <p className="mt-1">{user.customer_code}</p>
          </div>
          <div>
            <span className="font-semibold">First Name:</span>
            <p className="mt-1">{user.first_name}</p>
          </div>
          <div>
            <span className="font-semibold">Last Name:</span>
            <p className="mt-1">{user.last_name}</p>
          </div>
          <div>
            <span className="font-semibold">Email:</span>
            <p className="mt-1 flex items-center gap-2">
              {user.email}
              {user.is_email_verified ? (
                <span className="text-green-500 text-sm">✓ Verified</span>
              ) : (
                <span className="text-red-500 text-sm">✗ Not Verified</span>
              )}
            </p>
          </div>
          <div>
            <span className="font-semibold">Phone:</span>
            <p className="mt-1 flex items-center gap-2">
              {user.phone}
              {user.is_phone_verified ? (
                <span className="text-green-500 text-sm">✓ Verified</span>
              ) : (
                <span className="text-red-500 text-sm">✗ Not Verified</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">Address:</span>
            <p className="mt-1">{user.address}</p>
          </div>
          <div>
            <span className="font-semibold">Joined Date:</span>
            <p className="mt-1">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="font-semibold">Profile Updated:</span>
            <p className="mt-1">
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            setEditForm({
              first_name: user.first_name || "",
              last_name: user.last_name || "",
              phone: user.phone || "",
              address: user.address || ""
            });
            setIsEditOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={() => setIsChangePasswordOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
        >
          🔒 Change Password
        </button>
      </div>

      {/* Security Settings */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Security Settings
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300">
            Two-Factor Authentication (2FA)
          </span>
          <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={user.is_2FA_enabled || false}
                onChange={handle2FAChange}
              />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h2>

            <div className="space-y-3">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>



              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Password
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      current_password: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}