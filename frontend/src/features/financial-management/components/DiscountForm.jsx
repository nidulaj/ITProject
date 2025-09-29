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
    discount_code: "",
  });

  const [errors, setErrors] = useState({});
  const [existingCodes, setExistingCodes] = useState([]);

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
        discount_code: discount.discount_code || "",
      });
    } else {
      
      setFormData({
        discount_name: "",
        discount_type: "percentage",
        value: "",
        eligibility_criteria: "seasonal offer",
        valid_from: "",
        valid_to: "",
        discount_code: "",
      });
    }
  }, [discount]);


  useEffect(() => {
  const fetchCodes = async () => {
    try {
      const res = await authFetch({
        method: 'get',
        url: "http://localhost:5000/api/discounts",
      });
      const codes = res.data.map(d => d.discount_code?.toUpperCase());
      setExistingCodes(codes);
    } catch (err) {
      console.error("Error fetching discount codes:", err);
    }
  };

  fetchCodes();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    
  };


  const validateDiscountCode = (code) => {
  if (!code) {
    setErrors(prev => ({ ...prev, discount_code: "Discount code is required" }));
    return false;
  } else if (code.length < 3) {
    setErrors(prev => ({ ...prev, discount_code: "Must be at least 3 characters" }));
    return false;
  } else if (!discount && existingCodes.includes(code.toUpperCase())) {
    setErrors(prev => ({ ...prev, discount_code: "This discount code already exists" }));
    return false;
  } else {
    setErrors(prev => ({ ...prev, discount_code: null }));
    return true;
  }
};


  const preparePayload = (fd) => {
    
    return {
      discount_name: fd.discount_name,
      discount_type: fd.discount_type,
      value: fd.value === "" ? null : Number(fd.value),
      eligibility_criteria: fd.eligibility_criteria,
      valid_from: fd.valid_from || null,
      valid_to: fd.valid_to || null,
      discount_code: fd.discount_code,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const num = Number(formData.value);
    let hasError = false;

    // Validation for discount code
    if (!formData.discount_code) {
      setErrors((prev) => ({
        ...prev,
        discount_code: "Discount code is required",
      }));
      hasError = true;
    } else if (formData.discount_code.length < 3) {
      setErrors((prev) => ({
        ...prev,
        discount_code: "Discount code must be at least 3 characters",
      }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, discount_code: null }));
    }

    const isCodeValid = validateDiscountCode(formData.discount_code);
if (!isCodeValid) {
  hasError = true;
}


    // Validation for value (already partially included)
  if (formData.discount_type === "percentage" && (num < 1 || num > 100)) {
    setErrors((prev) => ({
      ...prev,
      value: "Percentage must be between 1 and 100",
    }));
    hasError = true;
  } else if (formData.discount_type === "fixed" && num <= 0) {
    setErrors((prev) => ({
      ...prev,
      value: "Fixed amount must be a positive number",
    }));
    hasError = true;
  } else {
    setErrors((prev) => ({ ...prev, value: null }));
  }

  // Date validations
  const today = new Date().setHours(0, 0, 0, 0); // Today at midnight
  const validFrom = new Date(formData.valid_from).setHours(0, 0, 0, 0);
  const validTo = new Date(formData.valid_to).setHours(0, 0, 0, 0);

  if (!formData.valid_from || validFrom < today) {
    setErrors((prev) => ({
      ...prev,
      valid_from: "Valid From must be today or a future date",
    }));
    hasError = true;
  } else {
    setErrors((prev) => ({ ...prev, valid_from: null }));
  }

  if (!formData.valid_to || validTo <= validFrom) {
    setErrors((prev) => ({
      ...prev,
      valid_to: "Valid To must be after Valid From",
    }));
    hasError = true;
  } else {
    setErrors((prev) => ({ ...prev, valid_to: null }));
  }

  // Prevent submission if any error exists
  if (hasError) {
    alert("Please fix errors in input values before submitting.");
    return;
  }
    
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
          discount_code: "",
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
          onInput={(e) => {
          const val = Number(e.target.value);
          if (formData.discount_type === "percentage" && val > 100) {
            e.target.value = 100;
          } else if (val < 1) {
            e.target.value = 1;
          }
        }}
          min={formData.discount_type === "fixed" ? 1 : 1}
          max={formData.discount_type === "percentage" ? 100 : undefined}
          required
          className={`border p-2 rounded ${errors.value ? "border-red-500" : ""}`}
        />
        {errors.value && (
          <span className="text-sm text-red-500 mt-1">{errors.value}</span>
        )}
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
        Discount Code:
        <input
          type="text"
          name="discount_code"
          value={formData.discount_code}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();;
            setFormData(prev => ({ ...prev, discount_code: value }));
            validateDiscountCode(value);
          }}
          placeholder="e.g., ABCD10"
          maxLength={10}
          required
          className={`border p-2 rounded ${errors.discount_code ? "border-red-500" : ""}`}
        />
        <span className="text-xs text-gray-500 mt-1">
          Enter a unique discount code (e.g., ABCD10, SAVE25)
        </span>
        {errors.discount_code && (
          <span className="text-sm text-red-500 mt-1">{errors.discount_code}</span>
        )}
      </label>

      <label className="flex flex-col">
        Valid From:
        <input
          type="date"
          name="valid_from"
          value={formData.valid_from}
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]} // Today’s date
          className="border p-2 rounded"
        />
        {errors.valid_from && (
          <span className="text-sm text-red-500 mt-1">{errors.valid_from}</span>
        )}

      </label>

      <label className="flex flex-col">
        Valid To:
        <input
          type="date"
          name="valid_to"
          value={formData.valid_to}
          onChange={handleChange}
          required
          min={formData.valid_from || new Date().toISOString().split("T")[0]}
          className="border p-2 rounded"
        />
        {errors.valid_to && (
          <span className="text-sm text-red-500 mt-1">{errors.valid_to}</span>
        )}

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
