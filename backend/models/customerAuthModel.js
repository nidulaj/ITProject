const {pool} = require("../db/dbConnect");

const createCustomer = async (firstName, lastName, email, phone, username, address, password) => {
    const query = `INSERT INTO "customers" ("first_name", "last_name", "email", "phone", "username", "address", "password") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [firstName, lastName, email, phone, username, address, password]
    const result = await pool.query(query, values)
    return result.rows[0]
};

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM "customers" WHERE "email" = $1`;
    const values = [email]
    const result = await pool.query(query, values)
    return result.rows[0]
};


module.exports = { createCustomer, findUserByEmail };