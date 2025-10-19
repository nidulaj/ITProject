import React, { useState, useEffect } from "react";
import { authFetch } from "../../user-management/utils/authFetchStaff";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const PaymentPage = ({ onUpdateStats }) => {
  const [payments, setPayments] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/payments",
      });
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await authFetch({
        method: "put",
        url: `http://localhost:5000/api/payments/status/${id}`,
        data: { status: newStatus },
      });
      fetchPayments();
      if (onUpdateStats) onUpdateStats();
    } catch (err) {
      alert(`❌ Failed to ${newStatus} payment.`);
      console.error(err);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    return (
      payment.customer_name?.toLowerCase().includes(query) ||
      payment.order_id?.toString().includes(query) ||
      payment.payment_status?.toLowerCase().includes(query) ||
      new Date(payment.payment_date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(query)
    );
  });



const downloadPDF = () => {
  try {
    const doc = new jsPDF();
    const isFiltered = searchQuery.trim() !== "";
    const recordsToExport = isFiltered ? filteredPayments : payments;

    if (!recordsToExport.length) {
      alert("No records to export.");
      return;
    }

    
    doc.setFontSize(16);
    doc.text(
      isFiltered ? "Filtered Payment Records" : "Payment Records Report",
      14,
      20
    );
    doc.setFontSize(10);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 28);

    
    const columns = ["Order ID", "Customer", "Amount", "Date", "Status"];
    const rows = recordsToExport.map((p) => [
      p?.order_id ?? "-",
      p?.customer_name ?? "-",
      `Rs. ${p?.amount ?? 0}`,
      new Date(p?.payment_date).toLocaleDateString(),
      p?.payment_status ?? "-",
    ]);

    
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 35,
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 10 },
    });

    
    doc.save(
      isFiltered
        ? `filtered_payments_${new Date().toISOString().slice(0, 10)}.pdf`
        : `payment_records_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    alert(
      isFiltered
        ? "Failed to export filtered records."
        : "Failed to export full records."
    );
  }
};


  return (
    <div className="p-8">
      <div className="mb-6">
      <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue-700">Payments</h1>
      <div className="flex items-center space-x-3">
      <input
        type="text"
        placeholder="Search by order ID, customer, status or date"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-blue-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

<button
  onClick={downloadPDF}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
>
  📄 Download Payment Report
</button>
     
    </div>
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
        <tr>
          <th className="px-6 py-3 text-left font-semibold">Order ID</th>
          <th className="px-6 py-3 text-left font-semibold">Customer</th>
          <th className="px-6 py-3 text-left font-semibold">Amount</th>
          <th className="px-6 py-3 text-left font-semibold">Date</th>
          <th className="px-6 py-3 text-left font-semibold">Status</th>
          <th className="px-6 py-3 text-left font-semibold">Proof</th>
          <th className="px-6 py-3 text-left font-semibold">Actions</th>
        </tr>
        </thead>

        <tbody className="divide-y divide-blue-100 text-gray-700 text-sm">
        {filteredPayments.map((payment) => (
          <tr
            key={payment.payment_id}
            className="hover:bg-blue-50 transition-all duration-200"
          >
          <td className="px-6 py-3 font-mono text-sm text-blue-600">#{payment.order_id}</td>
          <td className="px-6 py-3">{payment.customer_name}</td>
          <td className="px-6 py-3">Rs. {payment.amount}</td>
          <td className="px-6 py-3">
            {new Date(payment.payment_date).toLocaleDateString()}
          </td>
          <td className="px-6 py-3 capitalize">{payment.payment_status}</td>
          <td className="px-6 py-3">
            {payment.payment_proof ? (
              <button
                className="text-blue-600 underline hover:text-blue-800"
                onClick={() => setSelectedProof(payment.payment_proof)}
              >
                View receipt
              </button>
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </td>
          <td className="px-6 py-3 space-x-2">
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
          <td
            colSpan="7"
            className="text-center py-6 text-gray-500 italic"
          >
            No payments found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
      </div>


      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl relative max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Payment Proof
            </h2>

            <img
              src={`http://localhost:5000/uploads/${selectedProof}`}
              alt="Payment Proof"
              className="max-w-full max-h-[80vh] rounded-lg border"
            />

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
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





















