
const Payment = require("../models/paymentModel");

// Add a new payment
const addPayment = async (req, res) => {
  try {
    const { customer_name, amount, payment_date } = req.body;
    const payment_proof = req.file ? req.file.filename : null;

    // ✅ payment_status is not required from frontend anymore
    if (!customer_name || !amount || !payment_date) {
      return res.status(400).json({ message: "Customer name, amount, and payment date are required" });
    }

    // ✅ Default payment_status to "pending"
    const payment_status = "pending";

    const payment = await Payment.createPayment(
      customer_name,
      amount,
      payment_status,
      payment_date,
      payment_proof
    );

    res.status(201).json({ message: "Payment added successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error adding payment", error: error.message });
  }
};

// View all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Payment.updatePaymentStatus(id, "completed");

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment status updated to completed", payment: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};


module.exports = {
  addPayment,
  getPayments,
  approvePayment,
};


