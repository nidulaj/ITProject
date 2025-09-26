import React, { useState, useEffect } from "react";
import axios from "axios";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const DiscountForm = ({ discount, onSuccess }) => {
  const [formData, setFormData] = useState({
    discount_name: "",
    discount_type: "percentage",
    value: "",
    eligibility_criteria: "seasonal offer",
    valid_from: "",
    valid_to: "",
  });

  
  const toInputDate = (dateVal) => {
    if (!dateVal) return "";
    const s = String(dateVal);
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    
    try {
      const dt = new Date(s);
      if (!isNaN(dt)) return dt.toISOString().slice(0, 10);
    } catch (e) { }
    return "";
  };

  useEffect(() => {
    if (discount) {
      setFormData({
        discount_name: discount.discount_name || "",
        discount_type: discount.discount_type || "percentage",
        value: discount.value ?? "",
        eligibility_criteria: discount.eligibility_criteria || "seasonal offer",
        valid_from: toInputDate(discount.valid_from),
        valid_to: toInputDate(discount.valid_to),
      });
    } else {
      
      setFormData({
        discount_name: "",
        discount_type: "percentage",
        value: "",
        eligibility_criteria: "seasonal offer",
        valid_from: "",
        valid_to: "",
      });
    }
  }, [discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const preparePayload = (fd) => {
    
    return {
      discount_name: fd.discount_name,
      discount_type: fd.discount_type,
      value: fd.value === "" ? null : Number(fd.value),
      eligibility_criteria: fd.eligibility_criteria,
      valid_from: fd.valid_from || null,
      valid_to: fd.valid_to || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = preparePayload(formData);

      if (discount && discount.discount_id) {
        const res = await authFetch({
        method: 'put',
        url: `http://localhost:5000/api/discounts/${discount.discount_id}`,
        data: payload,
      });

        const saved = res.data;
        if (onSuccess) onSuccess(saved);
        alert("Discount updated successfully!");
      } else {
        
        const res = await authFetch({
        method: 'post',
        url: "http://localhost:5000/api/discounts",
        data: payload,
      });


        const saved = res.data;
        if (onSuccess) onSuccess(saved);
        alert("Discount added successfully!");
        setFormData({
          discount_name: "",
          discount_type: "percentage",
          value: "",
          eligibility_criteria: "seasonal offer",
          valid_from: "",
          valid_to: "",
        });
      }
    } catch (error) {
      console.error("Error saving discount:", error);
      alert("Failed to save discount.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full">
      <label className="flex flex-col">
        Discount Name:
        <input
          type="text"
          name="discount_name"
          value={formData.discount_name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Discount Type:
        <select
          name="discount_type"
          value={formData.discount_type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
      </label>

      <label className="flex flex-col">
        Value:
        <input
          type="number"
          name="value"
          value={formData.value}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Eligibility Criteria:
        <select
          name="eligibility_criteria"
          value={formData.eligibility_criteria}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="seasonal offer">Seasonal Offer</option>
          <option value="totalprice>2500">Total Price &gt; 2500</option>
          <option value="totalprice>5000">Total Price &gt; 5000</option>
          <option value="totalprice>10000">Total Price &gt; 10000</option>
        </select>
      </label>

      <label className="flex flex-col">
        Valid From:
        <input
          type="date"
          name="valid_from"
          value={formData.valid_from}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Valid To:
        <input
          type="date"
          name="valid_to"
          value={formData.valid_to}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </label>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => onSuccess && onSuccess(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {discount ? "Update Discount" : "Add Discount"}
        </button>
      </div>
    </form>
  );
};

export default DiscountForm;
