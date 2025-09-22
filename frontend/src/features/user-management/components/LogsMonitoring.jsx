import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";

export default function LogsMonitoring() {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: "http://localhost:5000/api/user-management/audit/logs",
        });
        setAuditLogs(res.data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchAuditLogs();
    const interval = setInterval(fetchAuditLogs, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Audit Logs</h2>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search by name/email"
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        <select className="w-40 px-3 py-2 border rounded-lg dark:bg-gray-700">
          <option>All Roles</option>
          <option>Customer</option>
          <option>Staff</option>
        </select>

        <button className="w-32 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add User
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 text-left">Log ID</th>
            <th className="p-2 text-left">User ID</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Action</th>
            <th className="p-2 text-left">Ip Address</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.log_id} className="border-t">
              <td className="p-2">{log.log_id}</td>
              <td className="p-2">{log.user_id}</td>
              <td className="p-2">
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td className="p-2">{log.action}</td>
              <td className="p-2">{log.ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
