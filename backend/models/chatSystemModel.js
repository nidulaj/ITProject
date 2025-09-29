const {pool} = require("../db/dbConnect");

const createMessage = async ({user_code, sender, message}) => {
  const query = "INSERT INTO chat_system (user_code, sender, message) VALUES ($1, $2, $3) RETURNING *";
  const values = [user_code, sender, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getMessagesByUserCode = async (user_code) => {
  const query = "SELECT * FROM chat_system WHERE user_code = $1 ORDER BY created_at  ASC";
  const values = [user_code];
  const result = await pool.query(query, values);
  return result.rows;
}

const getAll = async () => {
  const query = "SELECT * FROM chat_system ORDER BY created_at DESC";
  const result  = await pool.query(query);
  return result.rows;
}

module.exports = { createMessage, getMessagesByUserCode, getAll };
