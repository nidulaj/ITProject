import { useState } from "react";

export default function UserProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  // Hardcoded user data - replace with actual API calls later
  const [user, setUser] = useState({
    user_id: "USR001",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    profile_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    date_of_birth: "1990-05-15",
    address: "123 Main Street, New York, NY 10001",
    gender: "Male",
    is_email_verified: true,
    is_phone_verified: false,
    is_2FA_enabled: true,
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2024-03-20T14:45:00Z",
    membership_status: "Premium",
    last_login: "2024-03-25T09:15:00Z"
  });

  const [editForm, setEditForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    address: user.address,
    date_of_birth: user.date_of_birth,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const handleEditProfile = (e) => {
    if (e) e.preventDefault();
    // Simulate API call - replace with actual API call later
    console.log("Updating profile:", editForm);
    setUser(prev => ({ ...prev, ...editForm }));
    setIsEditOpen(false);
  };

  const handleChangePassword = (e) => {
    if (e) e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New passwords don't match!");
      return;
    }
    // Simulate API call - replace with actual API call later
    console.log("Changing password");
    setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    setIsChangePasswordOpen(false);
    alert("Password changed successfully!");
  };

  const handle2FAToggle = async (e) => {
    const isEnabled = e.target.checked;
    // Simulate API call - replace with actual API call later
    console.log("Toggling 2FA:", isEnabled);
    setUser(prev => ({ ...prev, is_2FA_enabled: isEnabled }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({ ...prev, profile_photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        My Profile
      </h2>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-4 py-6">
        <div className="relative">
          <img
            src={user.profile_photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click the camera icon to change your profile photo
        </p>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">User ID:</span>
            <p className="mt-1">{user.user_id}</p>
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
          <div>
            <span className="font-semibold">Date of Birth:</span>
            <p className="mt-1">{new Date(user.date_of_birth).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">Gender:</span>
            <p className="mt-1">{user.gender}</p>
          </div>
          <div>
            <span className="font-semibold">Address:</span>
            <p className="mt-1">{user.address}</p>
          </div>
          <div>
            <span className="font-semibold">Membership Status:</span>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.membership_status === 'Premium' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.membership_status}
              </span>
            </p>
          </div>
          <div>
            <span className="font-semibold">Member Since:</span>
            <p className="mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-semibold">Last Login:</span>
            <p className="mt-1">{new Date(user.last_login).toLocaleString()}</p>
          </div>
          <div>
            <span className="font-semibold">Profile Updated:</span>
            <p className="mt-1">{new Date(user.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsEditOpen(true)}
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
          <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication (2FA)</span>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={user.is_2FA_enabled}
              onChange={handle2FAToggle}
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
                    setEditForm((prev) => ({ ...prev, first_name: e.target.value }))
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
                    setEditForm((prev) => ({ ...prev, last_name: e.target.value }))
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
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, date_of_birth: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows={3}
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
                    setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))
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
                    setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))
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
                    setPasswordForm((prev) => ({ ...prev, confirm_password: e.target.value }))
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