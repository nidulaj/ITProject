const {pool} = require("../db/dbConnect");

const createCustomer = async (firstName, lastName, email, phone, address, password) => {
    const query = `INSERT INTO "customers" ("first_name", "last_name", "email", "phone", "address", "password") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [firstName, lastName, email, phone, address, password]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM "customers" WHERE "email" = $1`;
    const values = [email]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const login = async (email, password) => {
    const query = `SELECT * FROM "customers" WHERE "email" = $1 AND "password" = $2`;
    const values = [email, password]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const accountStatus = async (id) => {
    const query = `SELECT "isActive" FROM "customers" WHERE "cus_id" = $1`;
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const updateProfile = async (id, firstName, lastName, phone, address) => {
    const query = `UPDATE "customers" SET "first_name" = $1, "last_name" = $2, "phone" = $3, "address" = $4 WHERE "cus_id" = $5 RETURNING *`;
    const values = [firstName, lastName, phone, address, id]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const deleteProfile = async (id) => {
    const query = `DELETE FROM "customers" WHERE "cus_id" = $1 RETURNING *`;
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
};

module.exports = { createCustomer, findUserByEmail, login, updateProfile, deleteProfile, accountStatus };