import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, description, route, icon }) => {
  const navigate = useNavigate();

  return (
      <div
      onClick={() => navigate(route)}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
        <div className="flex items-center gap-4">
          <div className="text-blue-600">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
 
  );

  
};

export default DashboardCard;



