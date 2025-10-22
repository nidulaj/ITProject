import { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetchStaff";
import Swal from "sweetalert2";

export default function UserProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [user, setUser] = useState(null);

  // Handler for name fields - only allows letters and spaces
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
    setEditForm((prev) => ({ ...prev, [name]: filteredValue }));
  };

  // Handler for phone field - allows + at start and digits only
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/(?!^\+)\D/g, "");
    setEditForm((prev) => ({ ...prev, [name]: filteredValue }));
  };

  // Calculate password strength
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => {
      const newPasswordForm = { ...prev, [name]: value };

      if (name === "new_password") {
        setPasswordStrength(calculateStrength(value));
      }

      if (name === "new_password" || name === "confirm_password") {
        if (
          newPasswordForm.new_password &&
          newPasswordForm.confirm_password &&
          newPasswordForm.new_password !== newPasswordForm.confirm_password
        ) {
          setPasswordError("Passwords do not match");
        } else {
          setPasswordError("");
        }
      }

      return newPasswordForm;
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/staff/auth/userInfo`,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleEditProfile = (e) => {
    try {
      e.preventDefault();
    const res = authFetch({
      method: "put",
      url: `http://localhost:5000/api/staff/auth/updateUserDetails`,
      data: editForm,
    });
    console.log("Updating profile:", editForm);
    setUser((prev) => ({ ...prev, ...editForm }));
    setIsEditOpen(false);
    Swal.fire({
      title: "Success",
      text: "Profile updated successfully.",
      icon: "success",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to update profile.",
        icon: "error",
      });
    }
  };

  const handleChangePassword = (e) => {
    if (e) e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      Swal.fire({
        title: "Error",
        text: "New passwords don't match!",
        icon: "error",
      });
      return;
    }

    if (passwordStrength < 4) {
      Swal.fire({
        title: "Weak Password",
        text: "Please use a stronger password.",
        icon: "warning",
      });
      return;
    }

    try {
      const res = authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/updatePassword`,
        data: {
          currentPassword: passwordForm.current_password,
          newPassword: passwordForm.new_password,
        },
      });

      console.log(res.data);

      setIsChangePasswordOpen(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordStrength(0);
      setPasswordError("");
      Swal.fire({
        title: "Success",
        text: "Password changed successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to change password.",
        icon: "error",
      });
    }
  };

  const handle2FAChange = async (e) => {
    const isEnabled = e.target.checked;
    setIs2FAEnabled(isEnabled);

    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/staff/auth/change2FA`,
        data: { is2FAEnabled: isEnabled },
      });
      setUser((prev) => ({ ...prev, is_2FA_enabled: isEnabled }));
      Swal.fire({
        title: "Success",
        text: `2FA has been ${isEnabled ? "enabled" : "disabled"}.`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error changing 2FA setting:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to change 2FA setting.",
        icon: "error",
      });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    console.log("File received:", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/uploadProfilePhoto",
        data: formData,
      });

      setUser((prev) => ({
        ...prev,
        profile_photo: res.data.photoUrl,
      }));
      Swal.fire({
        title: "Success",
        text: "Profile photo uploaded successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to upload photo.",
        icon: "error",
      });
    }
  };

  const handlePhotoRemove = async () => {
    try {
      const res = await authFetch({
        method: "delete",
        url: "http://localhost:5000/api/staff/auth/removeProfilePhoto",
      });

      setUser((prev) => ({
        ...prev,
        profile_photo: null,
      }));
      Swal.fire({
        title: "Success",
        text: "Profile photo removed successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error removing photo:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove photo.",
        icon: "error",
      });
    }
  };

  const isPasswordValid =
    passwordStrength >= 4 &&
    passwordForm.new_password === passwordForm.confirm_password &&
    passwordForm.current_password;

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
            <span className="font-semibold">Staff ID:</span>
            <p className="mt-1">{user.staff_code}</p>
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
            <span className="font-semibold">Role:</span>
            <p className="mt-1">{user.role_name}</p>
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update your personal information
              </p>
            </div>

            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={editForm.first_name}
                  onChange={handleNameChange}
                  required
                  placeholder="John"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={editForm.last_name}
                  onChange={handleNameChange}
                  required
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="+94 7xxxxxxx"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
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

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative mx-4">
            <button
              onClick={() => {
                setIsChangePasswordOpen(false);
                setPasswordStrength(0);
                setPasswordError("");
              }}
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
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a strong password to secure your account
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {/* Password Strength Bar */}
                {passwordForm.new_password && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength <= 2
                            ? "bg-red-500"
                            : passwordStrength === 3
                            ? "bg-yellow-400"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {passwordStrength <= 2
                        ? "Weak password"
                        : passwordStrength === 3
                        ? "Medium strength"
                        : "Strong password"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordStrength(0);
                    setPasswordError("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors ${
                    !isPasswordValid
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}