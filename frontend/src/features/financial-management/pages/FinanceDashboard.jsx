/*import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import DiscountPage from "./DiscountPage";
import PaymentPage from "./PaymentPage";

import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard";
import { Clock, CheckCircle, Percent, Tag, CreditCard } from "lucide-react";
import { authFetch } from "../../user-management/utils/authFetchStaff";
import Header from "../components/Header";
import UserProfile from "../../user-management/components/UserProfile";

const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    pending_payments: 0,
    completed_payments: 0,
    total_discounts: 0,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/staff/auth/userInfo`,
        });
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/finance/stats",
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/finance/recent-activity",
      });
      setRecentActivity(res.data);
    } catch (err) {
      console.error("Error fetching activity:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 space-y-8">
      <Header userInfo={userInfo} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <StatCard
                  title="Pending Payments"
                  value={stats.pending_payments}
                  icon={<Clock />}
                  color="text-yellow-500"
                />
                <StatCard
                  title="Completed Payments"
                  value={stats.completed_payments}
                  icon={<CheckCircle />}
                  color="text-emerald-600"
                />
                <StatCard
                  title="Total Discounts"
                  value={stats.total_discounts}
                  icon={<Percent />}
                  color="text-green-500"
                />
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                  title="Manage Discounts"
                  description="Create, view, and manage discount policies."
                  route="discounts"
                  icon={<Tag />}
                />
                <DashboardCard
                  title="Manage Payments"
                  description="Record and monitor all customer payments."
                  route="payments"
                  icon={<CreditCard />}
                />
              </div>

              
              <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  📋 Recent Activity
                </h2>

                {recentActivity.length > 0 ? (
                  <ul className="space-y-4">
                    {recentActivity.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition duration-200 border-l-4 border-blue-500"
                      >
                        <div className="text-blue-500 text-xl">🔹</div>
                        <p className="text-gray-800 font-medium">
                          {item.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No recent activity yet.</p>
                )}
              </div>
            </>
          }
        />

        <Route
          path="/discounts"
          element={
            <DiscountPage
              onUpdateStats={fetchStats}
              onUpdateRecentActivity={fetchRecentActivity}
            />
          }
        />
        <Route
          path="/payments"
          element={<PaymentPage onUpdateStats={fetchStats} />}
        />
        <Route path="userProfile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default FinanceDashboard;*/





import React, { useEffect, useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import {
  LayoutGrid,
  CreditCard,
  Percent,
  Tag,
  Clock,
  CheckCircle2,
  BarChart3,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import DiscountPage from "./DiscountPage";
import PaymentPage from "./PaymentPage";
import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard";
import Header from "../components/Header";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // Green, Orange, Red

const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    pending_payments: 0,
    completed_payments: 0,
    total_discounts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState({ trend: [], status: [] });
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("overview");
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: `http://localhost:5000/api/staff/auth/userInfo`,
      });
      setUserInfo(res.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/finance/stats",
      });
      setStats(res.data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/finance/recent-activity",
      });
      setRecentActivity(res.data);
    } catch (err) {
      console.error("❌ Error fetching recent activity:", err);
    }
  };

  // 🔹 Fetch chart data (both line & pie chart)
  const fetchChartData = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/finance/chart-data",
      });

      setChartData({
        trend: res.data.trend || [],
        status: res.data.status || [],
      });
    } catch (error) {
      console.error("❌ Error fetching chart data:", error);

      // Fallback mock data with current stats
      setChartData(prevData => ({
        trend: [
          { day: "Mon", payments: 8 },
          { day: "Tue", payments: 15 },
          { day: "Wed", payments: 11 },
          { day: "Thu", payments: 17 },
          { day: "Fri", payments: 20 },
          { day: "Sat", payments: 12 },
          { day: "Sun", payments: 9 },
        ],
        status: [
          { name: "Completed", value: stats.completed_payments || 0 },
          { name: "Pending", value: stats.pending_payments || 0 },
        ],
      }));
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchUserInfo(), fetchStats(), fetchRecentActivity(), fetchChartData()]);
      setLoading(false);
    })();
  }, []);



  const totalPayments = useMemo(
    () => stats.pending_payments + stats.completed_payments,
    [stats]
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 to-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/90 backdrop-blur border-r border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-cyan-500 text-white rounded-lg">
            <LayoutGrid size={18} />
          </div>
          <h1 className="font-semibold text-slate-800">Finance Dashboard</h1>
        </div>
        <nav className="p-4 space-y-3 text-slate-700">
          {[
            { label: "Overview", key: "overview", icon: <BarChart3 size={18} /> },
            { label: "Payments", key: "payments", icon: <CreditCard size={18} /> },
            { label: "Discounts", key: "discounts", icon: <Tag size={18} /> },
            { label: "Activity", key: "activity", icon: <Activity size={18} /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition ${
                activePage === item.key
                  ? "bg-sky-100 text-sky-700 font-semibold"
                  : "hover:bg-slate-100"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Header userInfo={userInfo} />

        {loading ? (
          <div className="text-center text-gray-500 mt-40 text-lg">
            ⏳ Loading data...
          </div>
        ) : (
          <>
            {activePage === "overview" && (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <StatCard
                    title="Pending Payments"
                    value={stats.pending_payments}
                    icon={<Clock />}
                    color="from-yellow-400 to-amber-500"
                  />
                  <StatCard
                    title="Completed Payments"
                    value={stats.completed_payments}
                    icon={<CheckCircle2 />}
                    color="from-emerald-500 to-green-500"
                  />
                  <StatCard
                    title="Total Discounts"
                    value={stats.total_discounts}
                    icon={<Percent />}
                    color="from-indigo-500 to-blue-500"
                  />
                  <StatCard
                    title="Total Transactions"
                    value={totalPayments}
                    icon={<CreditCard />}
                    color="from-cyan-500 to-sky-500"
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                  {/* Line Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 size={18} className="text-sky-600" />
                      <h3 className="font-semibold text-slate-800">
                        Weekly Payment Trend
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={chartData.trend}>
                        <defs>
                          <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Area dataKey="payments" stroke="#0ea5e9" fill="url(#colorPay)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <PieIcon size={18} className="text-sky-600" />
                      <h3 className="font-semibold text-slate-800">Payment Status</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={chartData.status}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                          dataKey="value"
                        >
                          {chartData.status.map((entry, i) => {
                            // Assign colors based on payment status
                            let color = PIE_COLORS[i % PIE_COLORS.length]; // Default fallback
                            if (entry.name === 'Completed') {
                              color = '#10b981'; // Green
                            } else if (entry.name === 'Pending') {
                              color = '#f59e0b'; // Orange
                            } else if (entry.name === 'Declined') {
                              color = '#ef4444'; // Red
                            }
                            return <Cell key={i} fill={color} />;
                          })}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Management cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <DashboardCard
                    title="Manage Discounts"
                    description="Create and update discount policies."
                    icon={<Tag />}
                    onClick={() => setActivePage("discounts")}
                  />
                  <DashboardCard
                    title="Manage Payments"
                    description="View and approve payment records."
                    icon={<CreditCard />}
                    onClick={() => setActivePage("payments")}
                  />
                </div>
              </>
            )}

            {activePage === "payments" && <PaymentPage onUpdateStats={fetchStats} />}
            {activePage === "discounts" && (
              <DiscountPage
                onUpdateStats={fetchStats}
                onUpdateRecentActivity={fetchRecentActivity}
              />
            )}

            {/* Activity Section */}
            {activePage === "activity" && (
              <div className="bg-white p-8 rounded-2xl shadow border border-slate-100 mt-8">
                <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                  <Activity size={18} className="text-sky-600" /> Recent Activity
                </h3>

                {recentActivity.length ? (
                  <div className="grid gap-4">
                    {recentActivity.map((a, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-white to-sky-50 border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                      >
                        <p className="text-slate-700 text-sm font-medium leading-relaxed">
                          {a.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    No recent activity.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FinanceDashboard;














