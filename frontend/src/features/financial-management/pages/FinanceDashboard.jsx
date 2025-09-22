import React from "react";
import DashboardCard from "../components/DashboardCard";
import { Tag, CreditCard } from "lucide-react";

const FinanceDashboard = () => {
  return (
    <div className="p-8">
      <h1 className= "text-2xl font-bold text-blue-600 text-center">
        Finance Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Welcome to the financial management dashboard. Choose a section below
        to manage discounts or payments.
      </p>

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

export default FinanceDashboard;
