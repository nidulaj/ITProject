// backend/models/customizedOrderModel.js
const { pool } = require("../db/dbConnect");

const ALLOWED = {
  fruit: new Set(["strawberry", "blueberry", "mango"]),
  topping: new Set(["chocolate syrup", "strawberry syrup", "honey syrup"]),
  bottom: new Set(["cashew", "peanut", "armond"]), // keep 'armond' to match SQL
};
const STATUSES = new Set(["pending", "accepted", "rejected"]);

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
};
const dayISO = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
};
const minOrderDateISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
};

// LIST
const listAll = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM customized_odr ORDER BY created_at DESC, id DESC;`
  );
  return rows;
};

// CREATE
const createOne = async (p = {}) => {
  const { customer_name, address, email, fruit, topping, bottom, quantity, order_date } = p;

  if (!customer_name || !address || !email || !fruit || !topping || !bottom || quantity == null || !order_date)
    throw new Error("Missing required fields");

  if (!ALLOWED.fruit.has(fruit)) throw new Error("Invalid fruit");
  if (!ALLOWED.topping.has(topping)) throw new Error("Invalid topping");
  if (!ALLOWED.bottom.has(bottom)) throw new Error("Invalid bottom");
  if (!isEmail(email)) throw new Error("Invalid email");

  const q = toInt(quantity);
  if (!Number.isFinite(q) || q <= 0) throw new Error("Quantity must be a positive integer");

  const dISO = dayISO(order_date);
  if (!dISO) throw new Error("Invalid order_date");
  if (dISO < minOrderDateISO()) throw new Error("Order date must be at least 2 days from today");

  const { rows } = await pool.query(
    `INSERT INTO customized_odr
      (customer_name, address, email, fruit, topping, bottom, quantity, order_date, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
     RETURNING *;`,
    [
      customer_name.trim(),
      address.trim(),
      email.trim().toLowerCase(),
      fruit,
      topping,
      bottom,
      q,
      dISO,
    ]
  );
  return rows[0];
};

// UPDATE (customer editing content, not status)
const updateOne = async (id, p = {}) => {
  const { customer_name, address, email, fruit, topping, bottom, quantity, order_date } = p;

  if (!customer_name || !address || !email || !fruit || !topping || !bottom || quantity == null || !order_date)
    throw new Error("Missing required fields");

  if (!ALLOWED.fruit.has(fruit)) throw new Error("Invalid fruit");
  if (!ALLOWED.topping.has(topping)) throw new Error("Invalid topping");
  if (!ALLOWED.bottom.has(bottom)) throw new Error("Invalid bottom");
  if (!isEmail(email)) throw new Error("Invalid email");

  const q = toInt(quantity);
  if (!Number.isFinite(q) || q <= 0) throw new Error("Quantity must be a positive integer");

  const dISO = dayISO(order_date);
  if (!dISO) throw new Error("Invalid order_date");
  if (dISO < minOrderDateISO()) throw new Error("Order date must be at least 2 days from today");

  const { rows } = await pool.query(
    `UPDATE customized_odr
        SET customer_name=$1, address=$2, email=$3,
            fruit=$4, topping=$5, bottom=$6, quantity=$7, order_date=$8
      WHERE id=$9
      RETURNING *;`,
    [
      customer_name.trim(),
      address.trim(),
      email.trim().toLowerCase(),
      fruit,
      topping,
      bottom,
      q,
      dISO,
      id,
    ]
  );
  if (!rows.length) throw new Error("Order not found");
  return rows[0];
};

// UPDATE STATUS (PM only)
const updateStatus = async (id, status) => {
  if (!STATUSES.has(status)) throw new Error("Invalid status");
  const { rows } = await pool.query(
    `UPDATE customized_odr SET status=$1 WHERE id=$2 RETURNING *;`,
    [status, id]
  );
  if (!rows.length) throw new Error("Order not found");
  return rows[0];
};

// DELETE
const deleteOne = async (id) => {
  const { rowCount } = await pool.query(`DELETE FROM customized_odr WHERE id=$1`, [id]);
  if (!rowCount) throw new Error("Order not found");
  return true;
};

module.exports = { listAll, createOne, updateOne, updateStatus, deleteOne };
