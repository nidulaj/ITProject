const { pool } = require("../db/dbConnect");

const _assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const createReturn = async (payload = {}) => {
  const { product, customer, phone, reason, image_url } = payload;
  _assert(product && customer && reason, "Missing required fields");
  _assert(["customized","normal"].includes(product), "Invalid product");
  _assert(["damaged","wrong_item","quality"].includes(reason), "Invalid reason");

  const { rows } = await pool.query(
    `INSERT INTO returns (product, customer, phone, reason, image_url)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [product, customer.trim(), phone || null, reason, image_url || null]
  );
  return rows[0];
};

const listReturns = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM returns ORDER BY created_at DESC, id DESC`
  );
  return rows;
};

const updateReturn = async (id, payload = {}) => {
  const { product, customer, phone, reason, image_url } = payload;
  _assert(product && customer && reason, "Missing required fields");
  _assert(["customized","normal"].includes(product), "Invalid product");
  _assert(["damaged","wrong_item","quality"].includes(reason), "Invalid reason");

  const { rows } = await pool.query(
    `UPDATE returns
        SET product=$1, customer=$2, phone=$3, reason=$4, image_url=$5
      WHERE id=$6
      RETURNING *`,
    [product, customer.trim(), phone || null, reason, image_url || null, id]
  );
  _assert(rows.length, "Return not found");
  return rows[0];
};

const updateStatus = async (id, status) => {
  _assert(["pending","accept","reject"].includes(status), "Invalid status");
  const { rows } = await pool.query(
    `UPDATE returns SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );
  _assert(rows.length, "Return not found");
  return rows[0];
};

const deleteReturn = async (id) => {
  const { rowCount } = await pool.query(`DELETE FROM returns WHERE id=$1`, [id]);
  _assert(rowCount, "Return not found");
  return true;
};

module.exports = { createReturn, listReturns, updateReturn, updateStatus, deleteReturn };
