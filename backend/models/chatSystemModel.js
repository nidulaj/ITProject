const {pool} = require("../db/dbConnect");

const createMessage = async ({user_code, sender, message}) => {
  const query = "INSERT INTO chat_system (user_code, sender, message) VALUES ($1, $2, $3) RETURNING *";
  const values = [user_code, sender, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const createMessageByAdmin = async ({ user_code, sender, message }) => {
  const query = `
    INSERT INTO chat_system (user_code, sender, message, is_read)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
  const values = [user_code, sender, message, sender === "admin"]; 
  // if admin sends → mark read, if user sends → mark unread
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

const getUniqueUsers = async () => {
  const query = `
    SELECT DISTINCT user_code
    FROM chat_system
    ORDER BY user_code ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const markMessagesAsReadToAdmin = async (user_code) => {
  const query = "UPDATE chat_system SET is_read = true WHERE user_code = $1 AND sender = 'user'";
  const values = [user_code];
  await pool.query(query, values);
};

const getUsersWithUnread = async () => {
 const query = `
      SELECT u.user_code,
             COUNT(CASE WHEN c.is_read = false AND c.sender = 'user' THEN 1 END) AS unread_count
      FROM (SELECT DISTINCT user_code FROM chat_system) u
      LEFT JOIN chat_system c ON u.user_code = c.user_code
      GROUP BY u.user_code
      ORDER BY u.user_code ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

const getUnreadMessageCount = async() => {
  const query = `SELECT COUNT(*) FROM chat_system WHERE is_read = false`;
  const result = await pool.query(query);
  return result.rows[0].count;
};

module.exports = { createMessage, getMessagesByUserCode, getAll, getUniqueUsers, createMessageByAdmin, markMessagesAsReadToAdmin, getUsersWithUnread, getUnreadMessageCount };
