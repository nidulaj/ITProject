   import { useState, useEffect } from "react";
import { Users, Shield, Activity, MessageSquare, UserCheck, UserX, TrendingUp, Clock } from "lucide-react";
import { authFetch } from "../utils/authFetchStaff";

export default function Summary() {

const [customerCount, setCustomerCount] = useState(0);
const [staffCount, setStaffCount] = useState(0);
const [userRoleCount, setUserRoleCount] = useState(0);
const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    useEffect(() => {
      
      fetchCustomerCount();
      fetchStaffCount();
      fetchUserRoleCount();
      fetchUnreadMessageCount();
    }, []);

    const fetchCustomerCount = async () => {
        try {
          const res = await authFetch({
            method: "get",
            url: "http://localhost:5000/api/auth/customersCount",
          });
          setCustomerCount(res.data);
        } catch (error) {
          console.error("Error fetching customer list:", error);
        }
      };

      const fetchStaffCount = async () => {
        try {
          const res = await authFetch({
            method: "get",
            url: "http://localhost:5000/api/staff/auth/staffCount",
          });
          setStaffCount(res.data);
        } catch (error) {
          console.error("Error fetching staff count:", error);
        }
      };

      const fetchUserRoleCount = async () => {
        try {
          const res = await authFetch({
            method: "get",
            url: "http://localhost:5000/api/user-roles/roleCount",
          });
          setUserRoleCount(res.data);
        } catch (error) {
          console.error("Error fetching user role count:", error);
        }
      };
      

      const fetchUnreadMessageCount = async () => {
        try {
          const res = await authFetch({
            method: "get",
            url: "http://localhost:5000/api/chat/unread-count",
          });
          setUnreadMessagesCount(res.data);
        } catch (error) {
          console.error("Error fetching user role count:", error);
        }
      };


  return(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Staff */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{staffCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{customerCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* User Roles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User Roles</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{userRoleCount}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active roles configured</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{unreadMessagesCount}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Needs attention</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
  )
}