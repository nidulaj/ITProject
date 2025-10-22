const { pool } = require("../db/dbConnect");


const getFinanceStats = async (req, res) => {
  try {
    const pendingRes = await pool.query(`SELECT COUNT(*) FROM payments WHERE payment_status = 'pending'`);
    const completedRes = await pool.query(`SELECT COUNT(*) FROM payments WHERE payment_status = 'Completed'`);
    const discountRes = await pool.query(`SELECT COUNT(*) FROM "Discount"`);

    res.status(200).json({
      pending_payments: parseInt(pendingRes.rows[0].count),
      completed_payments: parseInt(completedRes.rows[0].count),
      total_discounts: parseInt(discountRes.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching finance stats:", error.message);
    res.status(500).json({ error: "Failed to fetch finance stats" });
  }
};


const getRecentActivity = async (req, res) => {
  try {
    const discountQuery = `
      SELECT 
        discount_id AS id, 
        discount_name AS name, 
        'Discount' AS type, 
        valid_from AS timestamp 
      FROM "Discount"
      ORDER BY discount_id DESC
      LIMIT 3
    `;

    const paymentQuery = `
      SELECT 
        payment_id AS id, 
        customer_name AS name, 
        'Payment' AS type, 
        payment_date AS timestamp, 
        payment_status 
      FROM payments
      ORDER BY payment_id DESC
      LIMIT 3
    `;

    const [discountsRes, paymentsRes] = await Promise.all([
      pool.query(discountQuery),
      pool.query(paymentQuery)
    ]);

    const discounts = discountsRes.rows.map((d) => ({
      id: `discount-${d.id}`,
      message: `Discount "${d.name}" created 🎉`,
      timestamp: d.timestamp,
    }));

    const payments = paymentsRes.rows.map((p) => ({
      id: `payment-${p.id}`,
      message: `Payment by ${p.name} ${
        p.payment_status.toLowerCase() === "completed" ? "approved ✅" : "received 🕒"
      }`,
      timestamp: p.timestamp,
    }));


    const combined = [...discounts, ...payments].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const formatted = combined.map((item) => ({
      id: item.id,
      message: item.message,
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching recent activity:", err);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
};

const getChartData = async (req, res) => {
  try {
    // Get weekly payment trend data (last 7 days)
    const trendQuery = `
      SELECT 
        TO_CHAR(payment_date, 'Dy') as day,
        COUNT(*) as payments
      FROM payments 
      WHERE payment_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY TO_CHAR(payment_date, 'Dy'), payment_date
      ORDER BY payment_date
    `;

    // Get payment status distribution
    const statusQuery = `
      SELECT 
        payment_status,
        COUNT(*) as count
      FROM payments 
      GROUP BY payment_status
    `;

    const [trendRes, statusRes] = await Promise.all([
      pool.query(trendQuery),
      pool.query(statusQuery)
    ]);

    // Format trend data for line chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trendData = days.map(day => {
      const found = trendRes.rows.find(row => row.day === day);
      return {
        day: day,
        payments: found ? parseInt(found.payments) : 0
      };
    });

    // Format status data for pie chart
    const statusData = statusRes.rows.map(row => ({
      name: row.payment_status === 'Completed' ? 'Completed' : 
            row.payment_status === 'pending' ? 'Pending' : 
            row.payment_status,
      value: parseInt(row.count)
    }));

    res.status(200).json({
      trend: trendData,
      status: statusData
    });
  } catch (error) {
    console.error("Error fetching chart data:", error.message);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};

module.exports = {
  getFinanceStats,
  getRecentActivity,
  getChartData
};

