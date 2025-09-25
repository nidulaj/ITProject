
const { pool } = require('../db/dbConnect'); // your db connection file


const createPayment = async (customer_name, amount, payment_status, payment_date, payment_proof) => {
  const result = await pool.query(
    `INSERT INTO payments (customer_name, amount, payment_status, payment_date, payment_proof) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [customer_name, amount, payment_status, payment_date, payment_proof]
  );
  return result.rows[0];
};


// Get all payments
const getAllPayments = async () => {
  const result = await pool.query("SELECT * FROM payments ORDER BY payment_id DESC");
  return result.rows;
};

const updatePaymentStatus = async (payment_id, status) => {
  const result = await pool.query(
    `UPDATE payments SET payment_status = $1 WHERE payment_id = $2 RETURNING *`,
    [status, payment_id]
  );
  return result.rows[0];
};


module.exports = {
  createPayment,
  getAllPayments,
  updatePaymentStatus,
};



