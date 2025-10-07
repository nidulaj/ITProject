import React, { useEffect, useState } from "react";
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

export default FinanceDashboard;
