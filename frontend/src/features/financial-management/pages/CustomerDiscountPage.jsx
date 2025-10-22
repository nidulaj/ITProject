import React, { useEffect, useState } from "react";
import { authFetchCustomer } from "../../user-management/utils/authFetchCustomer";
const CustomerDiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const res = await authFetchCustomer({
        method: "get",
        url: "http://localhost:5000/api/discounts",
      });
      setDiscounts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-10 tracking-wide drop-shadow-sm">
          Available Discounts for You
        </h1>

        {discounts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            <p>No discounts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {discounts.map((d) => (
              <div
                key={d.discount_id}
                className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.01] transition duration-300 ease-in-out"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {d.discount_name}
                </h2>
                <div className="text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Type:</span> {d.discount_type}
                  </p>
                  <p>
                    <span className="font-medium">Value:</span> {d.value}
                  </p>
                  <p>
                    <span className="font-medium">Criteria:</span> {d.eligibility_criteria}
                  </p>
                  <p>
                    <span className="font-medium">Code:</span>{" "}
                    <span className="font-mono text-sm px-2 py-1 rounded-md bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 shadow-sm">
                      {d.discount_code || "N/A"}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Valid:{" "}
                  <span className="font-medium">
                    {String(d.valid_from ?? "").slice(0, 10)}
                  </span>{" "}
                  →{" "}
                  <span className="font-medium">
                    {String(d.valid_to ?? "").slice(0, 10)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDiscountPage;

