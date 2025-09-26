import React, { useEffect, useState } from "react";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const CustomerDiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const res = await authFetch({
        method: 'get',
        url: "http://localhost:5000/api/discounts",
      });
      setDiscounts(res.data);
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
        Available Discounts for You
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((discount) => (
          <div
            key={discount.discount_id}
            className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition duration-300"
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">{discount.discount_name}</h2>
            <p><span className="font-semibold">Type:</span> {discount.discount_type}</p>
            <p><span className="font-semibold">Value:</span> {discount.value}</p>
            <p><span className="font-semibold">Criteria:</span> {discount.eligibility_criteria}</p>
            <p className="text-sm text-gray-500 mt-2">
              Valid: {discount.valid_from} → {discount.valid_to}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDiscountPage;
