const { pool } = require("../db/dbConnect");

const createStaff = async (firstName, lastName, email, phone, password, role) => {
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
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const storeVerificationCode = async (id, code) => {
    const query = "UPDATE staff SET verification_code=$1, verification_code_expires=NOW() + interval '3 minutes' WHERE staff_id=$2"
    const values = [code, id]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const getVerificationDetails = async (id) => {
    const query = "SELECT verification_code, verification_code_expires FROM staff WHERE staff_id=$1";
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteVerificationCode = async (id) => {
    const query = "UPDATE staff SET verification_code=NULL, verification_code_expires=NULL WHERE staff_id=$1";
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getAllStaff = async () => {
    const query = "SELECT s.staff_id, s.staff_code, s.first_name, s.last_name, s.email, s.phone, s.is_active, ur.role_name FROM staff s JOIN user_roles ur ON s.role = ur.role_id";
    const result = await pool.query(query);
    return result.rows;
};





module.exports = {
  createStaff,
  staffLogin,
  findStaffByEmail,
  storeVerificationCode,
  getVerificationDetails,
  deleteVerificationCode,
    findUserById,
    getAllStaff
};