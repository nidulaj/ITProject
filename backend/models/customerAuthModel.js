const { pool } = require("../db/dbConnect");

const createCustomer = async (
  firstName,
  lastName,
  email,
  phone,
  address,
  password
) => {
  const query = `INSERT INTO "customers" ("first_name", "last_name", "email", "phone", "address", "password") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [firstName, lastName, email, phone, address, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findCustomerByEmail = async (email) => {
  const query = `SELECT * FROM "customers" WHERE "email" = $1`;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT * FROM "customers" WHERE cus_id = $1`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const login = async (email, password) => {
  const query = `SELECT * FROM "customers" WHERE "email" = $1 AND "password" = $2`;
  const values = [email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateProfile = async (id, firstName, lastName, phone, address) => {
  const query = `UPDATE "customers" SET "first_name" = $1, "last_name" = $2, "phone" = $3, "address" = $4, "updated_at" = NOW() WHERE "cus_id" = $5 RETURNING *`;
  const values = [firstName, lastName, phone, address, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const selfDeleteProfile = async (id) => {
  const query = `UPDATE customers SET is_active = false, delete_type = 'self', deleted_at = NOW(), permanent_delete_at = NOW() + interval '30 days' WHERE cus_id = $1 RETURNING *`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const storeVerificationCode = async (id, code) => {
  const query =
    "UPDATE customers SET verification_code=$1, verification_code_expires=NOW() + interval '3 minutes' WHERE cus_id=$2";
  const values = [code, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getVerificationDetails = async (id) => {
  const query =
    "SELECT customer_code, verification_code, verification_code_expires FROM customers WHERE cus_id=$1";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteVerificationCode = async (id) => {
  const query =
    "UPDATE customers SET verification_code=NULL, verification_code_expires=NULL WHERE cus_id=$1";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const emailVerification = async (id) => {
  const query =
    'UPDATE "customers" SET is_email_verified = true WHERE cus_id=$1 RETURNING *';
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByGoogleId = async (googleId) => {
  const query = `SELECT * FROM "customers" WHERE "google_id" = $1`;
  const values = [googleId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const attachGoogleIdToUser = async (cusId, googleId) => {
  const query =
    "UPDATE customers SET google_id = $1, is_email_verified = true WHERE cus_id = $2 RETURNING *";
  const values = [googleId, cusId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllCustomers = async () => {
  const query = `SELECT * FROM "customers" ORDER BY "cus_id"`;
  const result = await pool.query(query);
  return result.rows;
};

const updateCustomerDetails = async (cusId, details) => {
  const query = `UPDATE customers 
                 SET first_name = $1, last_name = $2, phone = $3, address = $4
                 WHERE cus_id = $5`;
  const values = [
    details.first_name,
    details.last_name,
    details.phone,
    details.address,
    cusId,
  ];
  await pool.query(query, values);
  const result = await findUserById(cusId);
  return result;
};

const getCurrentPassword = async (cusId) => {
  const query = `SELECT password FROM customers WHERE cus_id = $1`;
  const values = [cusId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const changePassword = async (cusId, newPassword) => {
  const query = `UPDATE customers
                 SET password = $1
                 WHERE cus_id = $2`;
  const values = [newPassword, cusId];
  await pool.query(query, values);
  const userInfoQuery = `select * from customers where cus_id = $1`;
  const resultValues = [cusId];
  const result = await pool.query(userInfoQuery, resultValues);
  console.log(result.rows[0]);
  return result.rows[0];
};

const change2FA = async (cusId, isEnabled) => {
  const query = `UPDATE customers
                 SET "is_2FA_enabled" = $1
                 WHERE cus_id = $2`;
  const values = [isEnabled, cusId];
  await pool.query(query, values);
  const result = await findUserById(cusId);
  return result;
};

const updateProfilePhoto = async (customerId, photoUrl) => {
  const query = `UPDATE customers
     SET profile_photo = $1, updated_at = NOW()
     WHERE cus_id = $2
     RETURNING cus_id, first_name, last_name, email, phone, address, profile_photo`;
  const values = [photoUrl, customerId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const removeProfilePhoto = async (customerId) => {
  const query = `UPDATE customers 
     SET profile_photo = NULL, updated_at = NOW()
     WHERE cus_id = $1`;
  const values = [customerId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const removeUser = async (customerId) => {
  const query = `UPDATE customers set is_active = false, deactivated_until = null WHERE cus_id = $1 RETURNING *`;
  const values = [customerId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

const changeAccountStatus = async (customerId, isActive, deactivatedUntil) => {
  console.log(deactivatedUntil);
  const query = `UPDATE customers
                 SET is_active = $1, deactivated_until = NOW() + ($2 || '')::interval
                 WHERE cus_id = $3`;
  const values = [isActive, deactivatedUntil, customerId];
  await pool.query(query, values);
  const result = await findUserById(customerId);
  return result;
};

module.exports = {
  createCustomer,
  findCustomerByEmail,
  login,
  updateProfile,
  selfDeleteProfile,
  storeVerificationCode,
  getVerificationDetails,
  deleteVerificationCode,
  emailVerification,
  findUserById,
  findUserByGoogleId,
  attachGoogleIdToUser,
  getAllCustomers,
  updateCustomerDetails,
  getCurrentPassword,
  changePassword,
  change2FA,
  updateProfilePhoto,
  removeProfilePhoto,
  removeUser,
  changeAccountStatus
};
