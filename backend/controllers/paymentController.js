const Payment = require("../models/paymentModel");

// Add a new payment
const addPayment = async (req, res) => {
  try {
    const { customer_name, amount, payment_status, payment_date } = req.body;

    if (!customer_name || !amount || !payment_status || !payment_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = await Payment.createPayment(
      customer_name,
      amount,
      payment_status,
      payment_date
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

// Delete a payment
const removePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.deletePayment(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};

module.exports = {
  addPayment,
  getPayments,
  removePayment,
};
