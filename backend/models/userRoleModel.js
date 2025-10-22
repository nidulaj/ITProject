const { pool } = require("../db/dbConnect");

const createRole = async (role, description) => {
  const query = `INSERT INTO user_roles (role_name, description)
                 VALUES ($1, $2) RETURNING *`;
  const values = [role, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllRoles = async () => {
  const query = `SELECT 
    ur.role_id,
    ur.role_name,
    ur.created_at,
    ur.description,
    COUNT(s.staff_id) AS staff_count
FROM user_roles ur
LEFT JOIN staff s 
    ON ur.role_id = s.role
GROUP BY 
    ur.role_id,
    ur.role_name,
    ur.created_at,
    ur.description
ORDER BY ur.role_id;`;
  const result = await pool.query(query);
  return result.rows;
};

const deleteRole = async (roleId) => {
  const query = `DELETE FROM user_roles WHERE role_id = $1 RETURNING *`;
  const values = [roleId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getRoleById = async (roleId) => {
  const query = `SELECT * FROM user_roles WHERE role_id = $1`;
  const values = [roleId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateRole = async (roleId, roleName, description) => {
  const query = `UPDATE user_roles 
                 SET role_name = $1, description = $2
                 WHERE role_id = $3 RETURNING *`;
  const values = [roleName, description, roleId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserRoleCount = async() => {
  const query = `SELECT COUNT(*) FROM user_roles`;
  const result = await pool.query(query);
  return result.rows[0].count;
};

module.exports = {
  createRole,
  getAllRoles,
  deleteRole,
  getRoleById,
  updateRole,
  getUserRoleCount
};
