import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Reusable status update function
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/status/${id}`, {
        status: newStatus,
      });
      fetchPayments();
      
    } catch (err) {
      alert(`❌ Failed to ${newStatus} payment.`);
      console.error(err);
    }
    console.log(id, newStatus)
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
      </div>

      <table className="min-w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Proof</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id} className="border-t">
              <td className="px-4 py-2">{payment.customer_name}</td>
              <td className="px-4 py-2">Rs. {payment.amount}</td>
              <td className="px-4 py-2">
                {new Date(payment.payment_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 capitalize">{payment.payment_status}</td>

              <td className="px-4 py-2">
                {payment.payment_proof ? (
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setSelectedProof(payment.payment_proof)}
                  >
                    View
                  </button>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </td>

              <td className="px-4 py-2 space-x-2">
                {payment.payment_status.toLowerCase() === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(payment.payment_id, "Completed")
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(payment.payment_id, "Declined")
                      }
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-4 py-2 rounded-lg shadow text-white ${
                      payment.payment_status.toLowerCase() === "completed"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {payment.payment_status.charAt(0).toUpperCase() +
                      payment.payment_status.slice(1)}
                  </span>
                )}
              </td>
            </tr>
          ))}

          {payments.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-lg">
            <h2 className="text-xl font-bold mb-4">Payment Proof</h2>

            <img
              src={`http://localhost:5000/uploads/${selectedProof}`}
              alt="Payment Proof"
              className="max-w-full max-h-[80vh] rounded-lg"
            />

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedProof(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;



