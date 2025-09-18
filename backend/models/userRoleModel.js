const { pool } = require("../db/dbConnect");

const createRole = async (role, description) => {
  const query = `INSERT INTO user_roles (role_name, description)
                 VALUES ($1, $2) RETURNING *`;
  const values = [role, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllRoles = async () => {
  const query = `SELECT * FROM user_roles`;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createRole,
  getAllRoles
};