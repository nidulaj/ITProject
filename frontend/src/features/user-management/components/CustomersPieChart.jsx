import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { authFetch } from "../utils/authFetchStaff";

export default function CustomersPieChart() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: "http://localhost:5000/api/auth/activeCustomersCount",
        });

        const rows = res.data;

        const formatted = rows.map((row) => ({
          name: row.is_active ? "Active" : "Inactive",
          value: parseInt(row.count),
        }));

        setCustomers(formatted);
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };

    fetchCustomerList();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Customer Activation Status
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={customers}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {customers.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Active" ? "#4CAF50" : "#F44336"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderRadius: "8px",
            }}
            wrapperStyle={{
              color: "#000",
            }}
          />
          <Legend
            wrapperStyle={{
              color: "inherit", // respects dark/light text color
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
