import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";

export default function LogsMonitoring() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = `${log.user_id} ${log.action}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDate = dateFilter
      ? new Date(log.created_at).toISOString().split("T")[0] === dateFilter
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audit Logs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor system activity and user actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Auto-refresh: 3 min
          </span>
        </div>
      </div>

      {/* Search & Date Filter */}
      <div className="flex gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by user ID or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Date Picker */}
        <input
          type="date"
          value={dateFilter}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-blue-50 [&::-webkit-calendar-picker-indicator]:dark:hover:bg-gray-600 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:transition-all"
        />  
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Log ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <tr
                key={log.log_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  #{log.log_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {log.user_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center font-mono text-gray-600 dark:text-gray-300">
                    {log.ip_address}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No audit logs found
          </p>
        </div>
      )}
    </section>
  );
}
