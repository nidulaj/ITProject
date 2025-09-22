const { pool } = require("../db/dbConnect");

const createStaff = async (
  firstName,
  lastName,
  email,
  phone,
  password,
  role
) => {
  const query = `INSERT INTO staff (first_name, last_name, email, phone, password, role)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [firstName, lastName, email, phone, password, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const staffLogin = async (email, password) => {
  const query = `SELECT * FROM staff WHERE email=$1 AND password=$2`;
  const values = [email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findStaffByEmail = async (email) => {
  const query = `SELECT * FROM staff WHERE email=$1`;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT * FROM staff WHERE staff_id = $1`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const storeVerificationCode = async (id, code) => {
  const query =
    "UPDATE staff SET verification_code=$1, verification_code_expires=NOW() + interval '3 minutes' WHERE staff_id=$2";
  const values = [code, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getVerificationDetails = async (id) => {
  const query =
    "SELECT verification_code, verification_code_expires FROM staff WHERE staff_id=$1";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteVerificationCode = async (id) => {
  const query =
    "UPDATE staff SET verification_code=NULL, verification_code_expires=NULL WHERE staff_id=$1";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllStaff = async () => {
  const query =
    "SELECT s.staff_id, s.staff_code, s.first_name, s.last_name, s.email, s.phone, s.is_active, ur.role_name FROM staff s JOIN user_roles ur ON s.role = ur.role_id";
  const result = await pool.query(query);
  return result.rows;
};

const getStaffByRole = async (roleId) => {
  const query = "SELECT * FROM staff WHERE role=$1";
  const values = [roleId];
  const result = await pool.query(query, values);
  return result.rows;
};

const getStaffById = async (id) => {
  const query = `SELECT s.staff_id, s.staff_code, s.first_name, s.last_name, s.email, s.phone, s.is_active, s.is_email_verified, s.is_phone_verified, s."is_2FA_enabled", s.created_at, s.updated_at, ur.role_name
               FROM staff s JOIN user_roles ur ON s.role = ur.role_id
               WHERE s.staff_id = $1`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const changeRole = async (newRoleId, staffId) => {
  const query = `UPDATE staff 
                 SET role = $1
                 WHERE staff_id = $2`;
  const values = [newRoleId, staffId];
  await pool.query(query, values);
  const result = await getStaffById(staffId);
  return result;
};

const changeAccountStatus = async (staffId, isActive, deactivatedUntil) => {
  console.log(deactivatedUntil);
  const query = `UPDATE staff 
                 SET is_active = $1, deactivated_until = NOW() + ($2 || '')::interval
                 WHERE staff_id = $3`;
  const values = [isActive, deactivatedUntil, staffId];
  await pool.query(query, values);
  const result = await getStaffById(staffId);
  return result;
};

const change2FA = async (staffId, isEnabled) => {
  const query = `UPDATE staff 
                 SET "is_2FA_enabled" = $1
                 WHERE staff_id = $2`;
  const values = [isEnabled, staffId];
  await pool.query(query, values);
  const result = await getStaffById(staffId);
  return result;
};

const updateStaffDetailsByAdmin = async (staffId, details) => {
  const query = `UPDATE staff 
                 SET first_name = $1, last_name = $2, phone = $3
                 WHERE staff_id = $4`;
  const values = [details.first_name, details.last_name, details.phone, staffId];
  await pool.query(query, values);
  const result = await getStaffById(staffId);
  return result;
};

const removeUser = async (staffId) => {
  const query = `UPDATE staff set is_active = false, deactivated_until = null WHERE staff_id = $1 RETURNING *`;
  const values = [staffId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  createStaff,
  staffLogin,
  findStaffByEmail,
  storeVerificationCode,
  getVerificationDetails,
  deleteVerificationCode,
  findUserById,
  getAllStaff,
  getStaffByRole,
  getStaffById,
  changeRole,
  changeAccountStatus,
  change2FA,
  updateStaffDetailsByAdmin,
  removeUser
};
