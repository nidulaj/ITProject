const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DBHost,
  user: process.env.DBUser,
  port: process.env.DBPort,
  password: process.env.DBPassword,
  database: process.env.DBDatabase,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
  }
};

module.exports = { pool, connectDB };
