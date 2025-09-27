import React, { useState, useEffect } from "react";
import axios from "axios";

import { authFetchCustomer } from "../../user-management/utils/authFetchCustomer";
import { useNavigate, useLocation } from "react-router-dom";


const PaymentForm = ({ onUpdateStats }) => {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Pre-populate form with order data if available
  useEffect(() => {
    if (location.state) {
      const { orderData, totalAmount, customerName: passedCustomerName } = location.state;
      
      if (passedCustomerName) {
        setCustomerName(passedCustomerName);
      }
      
      if (totalAmount) {
        setAmount(totalAmount.toString());
      }
      
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setPaymentDate(today);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("customer_name", customerName);
      formData.append("amount", amount);
      formData.append("payment_date", paymentDate);
      formData.append("payment_proof", paymentProof);

      /*await axios.post("http://localhost:5000/api/payments", formData, {
        headers: { "Content-Type": "multipart/form-data", },
      });*/

      const res = await authFetchCustomer({
      method: 'post',
      url: "http://localhost:5000/api/payments",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


      alert("✅ Payment submitted successfully!");
      if (onUpdateStats) onUpdateStats();
      setCustomerName("");
      setAmount("");
      setPaymentDate("");
      setPaymentProof(null);

      navigate("/payments");

    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("❌ Payment failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 text-center">
        Complete Your Payment
      </h2>

      <div>
        <label className="block text-gray-700">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Payment Date</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Upload Proof</label>
        <input
          type="file"
          name="payment_proof"
          onChange={(e) => setPaymentProof(e.target.files[0])}
          className="w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Submit Payment
      </button>
    </form>
  );
};

export default PaymentForm;





