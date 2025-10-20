/*import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center space-x-4">
      <div className={`text-4xl p-3 rounded-full bg-gray-100 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;*/


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










