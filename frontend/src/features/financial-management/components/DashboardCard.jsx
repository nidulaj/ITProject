import React from "react";
import { ChevronRight } from "lucide-react";

const DashboardCard = ({ title, description, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition transform border border-slate-100 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <ChevronRight className="text-slate-400" />
      </div>
    </div>
  );
};

export default DashboardCard;














