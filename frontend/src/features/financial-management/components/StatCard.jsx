import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition transform hover:-translate-y-1 flex items-center gap-4 border border-slate-100">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h2 className="text-2xl font-semibold text-slate-800">{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;


