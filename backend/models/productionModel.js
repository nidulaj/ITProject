const { pool } = require("../db/dbConnect");

// auto mark >40min in-production as completed
const autoCompleteOldProductions = async () => {
  await pool.query(
    `UPDATE productions
     SET status='completed'
     WHERE status='in production'
       AND created_at <= now() - interval '40 minutes'`
  );
};

const createProductionFromRequest = async (req_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const reqRes = await client.query(
      `SELECT req_id, recipe_no, quantity, status
       FROM req_ingredients
       WHERE req_id = $1`,
      [req_id]
    );
    if (reqRes.rows.length === 0) throw new Error("Request not found");
    const rq = reqRes.rows[0];

    if (rq.status !== "accept") {
      throw new Error("Request must be 'accept' before starting production");
    }

    const prodRes = await client.query(
      `INSERT INTO productions (recipe_no, quantity, status)
       VALUES ($1,$2,'in production')
       RETURNING *`,
      [rq.recipe_no, rq.quantity]
    );

    await client.query(
      `UPDATE req_ingredients SET status='processing' WHERE req_id=$1`,
      [rq.req_id]
    );

    await client.query("COMMIT");
    return prodRes.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

const listProductions = async () => {
  await autoCompleteOldProductions();
  const { rows } = await pool.query(
    `SELECT * FROM productions ORDER BY id DESC`
  );
  return rows;
};

const updateProductionStatusModel = async (batchId, status) => {
  const { rowCount } = await pool.query(
    `UPDATE productions
     SET status = $1
     WHERE batch_id = $2`,
    [status, batchId]
  );
  return rowCount > 0; // returns true if a row was updated
};


module.exports = {
  createProductionFromRequest,
  listProductions,
  updateProductionStatusModel,
};
