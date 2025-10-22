import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const BarChartCard = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Production Quantities</h2>

      {/* Scrollable area */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        <ResponsiveContainer width="100%" height={Math.min(400, data.length * 40)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="recipe_no" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;
