const { pool } = require("../db/dbConnect");

// Auto-generate ingredient code (ING001, ING002…)
const generateIngredientCode = async () => {
  const result = await pool.query(
    "SELECT ingredient_code FROM icode ORDER BY ingredient_id DESC LIMIT 1"
  );

  if (result.rows.length === 0) {
    return "ICD001";
  } else {
    const lastCode = result.rows[0].ingredient_code; // ICD005
    const num = parseInt(lastCode.replace("ICD", "")) + 1;
    return "ICD" + num.toString().padStart(3, "0");
  }
};

// CREATE
const createIcode = async (name) => {
  const code = await generateIngredientCode();
  const result = await pool.query(
    "INSERT INTO icode (ingredient_code, name) VALUES ($1, $2) RETURNING *",
    [code, name]
  );
  return result.rows[0];
};

// READ all
const getAllIcodes = async () => {
  const result = await pool.query("SELECT * FROM icode ORDER BY ingredient_id ASC");
  return result.rows;
};

// UPDATE
const updateIcode = async (id, name) => {
  const result = await pool.query(
    "UPDATE icode SET name = $1 WHERE ingredient_id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0];
};

// DELETE
const deleteIcode = async (id) => {
  await pool.query("DELETE FROM icode WHERE ingredient_id = $1", [id]);
  return { message: "Deleted successfully" };
};

module.exports = {
  createIcode,
  getAllIcodes,
  updateIcode,
  deleteIcode,
};
