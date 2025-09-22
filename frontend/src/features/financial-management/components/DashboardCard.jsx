import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, description, route, icon }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex items-center space-x-4"
    >
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
