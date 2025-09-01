const { pool } = require('../db/dbConnect'); // your db connection file

// Create a new payment
const createPayment = async (customer_name, amount, payment_status, payment_date) => {
  const result = await db.query(
    "INSERT INTO payments (customer_name, amount, payment_status, payment_date) VALUES ($1, $2, $3, $4) RETURNING *",
    [customer_name, amount, payment_status, payment_date]
  );
  return result.rows[0];
};

// Get all payments
const getAllPayments = async () => {
  const result = await db.query("SELECT * FROM payments ORDER BY payment_id DESC");
  return result.rows;
};

// Delete a payment
const deletePayment = async (payment_id) => {
  const result = await db.query(
    "DELETE FROM payments WHERE payment_id = $1 RETURNING *",
    [payment_id]
  );
  return result.rows[0];
};

module.exports = {
  createPayment,
  getAllPayments,
  deletePayment,
};
