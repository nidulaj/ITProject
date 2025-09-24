/*import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard"; // New stat card component
import { Banknote, Clock, CheckCircle, Percent, Tag, CreditCard } from "lucide-react";
import axios from "axios";



const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    pending_payments: 0,
    completed_payments: 0,
    total_discounts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finance/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Finance Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">

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
          route="/discounts"
          icon={<Tag />}
        />
        <DashboardCard
          title="Manage Payments"
          description="Record and monitor all customer payments."
          route="/payments"
          icon={<CreditCard />}
        />
      </div>
    </div>
  );
};

export default FinanceDashboard;*/


import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import DiscountPage from "./DiscountPage";
import PaymentPage from "./PaymentPage";
import PaymentFormPage from "./PaymentFormPage";
import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard";
import { Banknote, Clock, CheckCircle, Percent, Tag, CreditCard } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";




const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    pending_payments: 0,
    completed_payments: 0,
    total_discounts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finance/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Finance Dashboard
      </h1>

      

      {/* Nested Routing */}
      <Routes>
        {/* Dashboard Home */}
        <Route
          path="/"
          element={
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
                  route="/discounts"
                  icon={<Tag />}
                />
                <DashboardCard
                  title="Manage Payments"
                  description="Record and monitor all customer payments."
                  route="/payments"
                  icon={<CreditCard />}
                />
              </div>
            </>
          }
        />

        {/* Discounts */}
        <Route path="/discounts" element={<DiscountPage />} />

        {/* Payments */}
        <Route path="/payments" element={<PaymentPage />} />
        
      </Routes>
    </div>
  );
};

export default FinanceDashboard;








