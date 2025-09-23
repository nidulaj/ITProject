const { pool } = require("../db/dbConnect");

const getFinanceStats = async (req, res) => {
  try {
    //const totalPaymentsRes = await pool.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM payments`);
    const pendingRes = await pool.query(`SELECT COUNT(*) FROM payments WHERE payment_status = 'pending'`);
    const completedRes = await pool.query(`SELECT COUNT(*) FROM payments WHERE payment_status = 'Completed'`);
    const discountRes = await pool.query(`SELECT COUNT(*) FROM "Discount"`);

    res.status(200).json({
      //total_payments: totalPaymentsRes.rows[0].total,
      pending_payments: parseInt(pendingRes.rows[0].count),
      completed_payments: parseInt(completedRes.rows[0].count),
      total_discounts: parseInt(discountRes.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching finance stats:", error.message);
    res.status(500).json({ error: "Failed to fetch finance stats" });
  }
};

module.exports = { getFinanceStats };
