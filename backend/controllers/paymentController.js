const Payment = require("../models/paymentModel");
const { pool } = require("../db/dbConnect");
const { sendPaymentStatusEmail } = require("../utils/emailService");

const addPayment = async (req, res) => {
  try {
    const { order_id, customer_name, amount, payment_date } = req.body;
    const payment_proof = req.file ? req.file.filename : null;

    console.log('Payment controller received:', {
      order_id,
      customer_name,
      amount,
      payment_date,
      payment_proof
    });
    
    console.log('Full request body:', req.body);
    console.log('Request headers:', req.headers);

    if (!customer_name || !amount || !payment_date) {
      return res.status(400).json({ message: "Customer name, amount, and payment date are required" });
    }

    const payment_status = "pending";

    const payment = await Payment.createPayment(
      order_id,
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


const getPayments = async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};


/*const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Incoming status update request:");
  console.log("Payment ID:", id);
  console.log("New Status:", status);

  try {
    const result = await pool.query(
      `UPDATE payments SET payment_status = $1 WHERE payment_id = $2 RETURNING *`,
      [status, Number(id)]
    );

    console.log("Postgres result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status." });
  }
};*/


const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE payments SET payment_status = $1 WHERE payment_id = $2 RETURNING *`,
      [status, Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    const updatedPayment = result.rows[0];


    /*const [firstName, lastName] = updatedPayment.customer_name.split(" ");

    const customerEmailResult = await pool.query(
      `SELECT email FROM customers 
      WHERE LOWER(first_name) = LOWER($1)
      AND (LOWER(last_name) = LOWER($2) OR $2 IS NULL)
      LIMIT 1`,
      [firstName, lastName || null]
    );*/

    const nameParts = updatedPayment.customer_name.trim().split(" ");
const firstName = nameParts[0];
const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

let customerEmailResult;

if (lastName) {
  // ✅ Two-part name
  customerEmailResult = await pool.query(
    `SELECT email FROM customers 
     WHERE LOWER(first_name) = LOWER($1)
     AND LOWER(last_name) = LOWER($2)
     LIMIT 1`,
    [firstName, lastName]
  );
} else {
  // ✅ Single-part name
  customerEmailResult = await pool.query(
    `SELECT email FROM customers 
     WHERE LOWER(first_name) = LOWER($1)
     LIMIT 1`,
    [firstName]
  );
}

console.log("Customer email query result:", customerEmailResult.rows);


    console.log("Customer email query result:", customerEmailResult.rows);

    if (customerEmailResult.rows.length > 0) {
      const customerEmail = customerEmailResult.rows[0].email;

      // ✅ Send email when approved or declined
      if (status === "approved" || status === "declined") {
        await sendPaymentStatusEmail(
          customerEmail,
          updatedPayment.customer_name,
          updatedPayment.amount,
          updatedPayment.order_id,
          status
        );
      }
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status." });
  }
};




module.exports = {
  addPayment,
  getPayments,
  updatePaymentStatus,
};


