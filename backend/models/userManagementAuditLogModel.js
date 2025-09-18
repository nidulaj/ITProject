const { pool } = require("../db/dbConnect");

const createLog = async (userId, action, ipAddress) => {
  const query = `INSERT INTO audit_logs (user_id, action, ip_address)
                 VALUES ($1, $2, $3) RETURNING *`;
  const values = [userId, action, ipAddress];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllLogs = async () => {
  const query = `SELECT * FROM audit_logs ORDER BY log_id DESC`;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createLog,
  getAllLogs
};