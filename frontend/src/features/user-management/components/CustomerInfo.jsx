import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../utils/authFetchStaff";
import { useNavigate } from "react-router-dom";

export default function CustomerInfo() {
  const { customerId } = useParams();
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(null);
  const [accountStatus, setAccountStatus] = useState({
    isActive: null,
    deactivationPeriod: "default",
  });
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

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

  // Handler for address field
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/auth/customerDetailsForAdmin/${customerId}`,
        });
        setCustomer(res.data);

        setAccountStatus({
          isActive: res.data.is_active,
          deactivationPeriod: res.data.deactivated_until || null,
        });

        setEditForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone: res.data.phone,
          address: res.data.address,
        });
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleChangeAccountStatus = async (e) => {
    e.preventDefault();
    const willBeActive = e.target.checked;

    if (
      !willBeActive &&
      (!accountStatus.deactivationPeriod ||
        accountStatus.deactivationPeriod === "default")
    ) {
      Swal.fire({
        title: "Error",
        text: "Please select a deactivation period before disabling the account.",
        icon: "error",
      });
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
        url: `http://localhost:5000/api/auth/changeAccountActivation/${customerId}`,
        data: newStatus,
      });
      Swal.fire({
        title: "Success",
        text: "Account status updated successfully.",
        icon: "success",
      });
      setCustomer(res.data);
    } catch (error) {
      console.error("Error changing account status:", error);
      Swal.fire({
        title: "Error",
        text: "Account status update failed.",
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
        url: `http://localhost:5000/api/auth/change2FASetting/${customerId}`,
        data: { is2FAEnabled: isEnabled },
      });
      Swal.fire({
        title: "Success",
        text: "2FA setting updated successfully.",
        icon: "success",
      });
      setCustomer(res.data);
    } catch (error) {
      console.error("Error changing 2FA setting:", error);
      Swal.fire({
        title: "Error",
        text: "2FA setting update failed.",
        icon: "error",
      });
    }
  };

  const handleEditCustomerDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/auth/changeCustomerDetails/${customerId}`,
        data: editForm,
      });
      setCustomer(res.data);
      setIsEditOpen(false);
      Swal.fire({
        title: "Success",
        text: "Customer details updated successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error editing staff details:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update customer details.",
        icon: "error",
      });
    }
  };

  const handleRemoveUser = async () => {
    try {
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/auth/removeCustomerAccount/${customerId}`,
      });
      Swal.fire({
        title: "Success",
        text: "Customer account removed successfully.",
        icon: "success",
      });
      navigate("/dashboard/admin/staff");
    } catch (error) {
      console.error("Error removing staff member:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove customer account.",
        icon: "error",
      });
    }
  };

  if (!customer) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Loading customer details...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Details
        </h2>
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              customer.is_active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {customer.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Profile Photo and Basic Info Section */}
      <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Profile Photo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <img
              src={
                customer.profile_photo || "/src/assets/default-user-icon.png"
              }
              alt="Customer Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-lg"
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {customer.first_name} {customer.last_name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Customer ID: {customer.customer_code}
            </p>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">
                Contact Information
              </span>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  {customer.email}
                  {customer.is_email_verified ? (
                    <span className="text-green-500 text-xs">✓ Verified</span>
                  ) : (
                    <span className="text-red-500 text-xs">✗ Not Verified</span>
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  {customer.phone}
                  {customer.is_phone_verified ? (
                    <span className="text-green-500 text-xs">✓ Verified</span>
                  ) : (
                    <span className="text-red-500 text-xs">✗ Not Verified</span>
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Address:</span>
                  {customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">
                Account Timeline
              </span>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(customer.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-900 dark:text-white block mb-2">
                Account Status
              </span>
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
                    <option value="1 hour">1 Hour</option>
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
              {!accountStatus.isActive && customer.deactivated_until && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Account will be active on:{" "}
                  {new Date(customer.deactivated_until).toLocaleString()}
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
          disabled={!customer.is_active && customer.deactivated_until === null}
          className={`px-4 py-2 rounded-lg shadow transition text-white 
            ${
              !customer.is_active && customer.deactivated_until === null
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          ✏️ Edit Details
        </button>

        <button
          onClick={handleRemoveUser}
          disabled={!customer.is_active && customer.deactivated_until === null}
          className={`px-4 py-2 rounded-lg text-white shadow transition
            ${
              !customer.is_active && customer.deactivated_until === null
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
              <span className="font-medium text-gray-900 dark:text-white">
                Email Verified
              </span>
              <label className="flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!customer.is_email_verified}
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
              <span className="font-medium text-gray-900 dark:text-white">
                Phone Verified
              </span>
              <label className="flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!customer.is_phone_verified}
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
              <span className="font-medium text-gray-900 dark:text-white">
                2FA Enabled
              </span>
              <label
                className={`flex items-center ${
                  !customer.is_active && customer.deactivated_until === null
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={customer.is_2FA_enabled || false}
                  onChange={handle2FAChange}
                  disabled={
                    !customer.is_active && customer.deactivated_until === null
                  }
                />
                <div
                  className={`w-11 h-6 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                    peer-checked:after:translate-x-full
                    ${
                      !customer.is_active && customer.deactivated_until === null
                        ? "bg-gray-300"
                        : "bg-gray-200 peer-checked:bg-green-500"
                    }`}
                ></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative mx-4 max-h-[90vh] overflow-y-auto">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Customer Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update customer information
              </p>
            </div>

            <form onSubmit={handleEditCustomerDetails} className="space-y-4">
              {/* First Name */}
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

              {/* Last Name */}
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

              {/* Phone Number */}
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

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Address
                </label>
                <textarea
                  name="address"
                  value={editForm.address}
                  onChange={handleAddressChange}
                  required
                  placeholder="123 Main Street, City"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
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
    </div>
  );
}
