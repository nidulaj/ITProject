const { pool } = require("../db/dbConnect");

// CREATE
const createReqIngredients = async (recipe_no, quantity) => {
  try {
    const recipeResult = await pool.query(
      "SELECT * FROM recipe WHERE recipe_no = $1",
      [recipe_no]
    );

    if (recipeResult.rows.length === 0) throw new Error("Recipe not found");

    const recipe = recipeResult.rows[0];

    const totals = {
      total_strawberry: recipe.strawberry * quantity,
      total_mango: recipe.mango * quantity,
      total_blueberry: recipe.blueberry * quantity,
      total_milk: recipe.milk * quantity,
      total_culture: recipe.culture * quantity,
      total_sugar: recipe.sugar * quantity,
      total_topping1: recipe.topping1 * quantity,
      total_topping2: recipe.topping2 * quantity,
      total_topping3: recipe.topping3 * quantity,
      total_bottom1: recipe.bottom1 * quantity,
      total_bottom2: recipe.bottom2 * quantity,
      total_bottom3: recipe.bottom3 * quantity,
    };

    const result = await pool.query(
      `INSERT INTO req_ingredients 
      (recipe_no, quantity, total_strawberry, total_mango, total_blueberry, total_milk, total_culture, total_sugar,
       total_topping1, total_topping2, total_topping3, total_bottom1, total_bottom2, total_bottom3)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        recipe_no,
        quantity,
        totals.total_strawberry,
        totals.total_mango,
        totals.total_blueberry,
        totals.total_milk,
        totals.total_culture,
        totals.total_sugar,
        totals.total_topping1,
        totals.total_topping2,
        totals.total_topping3,
        totals.total_bottom1,
        totals.total_bottom2,
        totals.total_bottom3,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error creating req_ingredients:", err);
    throw err;
  }
};

// READ all
const getAllReqIngredients = async () => {
  const result = await pool.query("SELECT * FROM req_ingredients ORDER BY req_id ASC");
  return result.rows;
};

// DELETE
const deleteReqIngredients = async (req_id) => {
  const result = await pool.query("DELETE FROM req_ingredients WHERE req_id = $1 RETURNING *", [req_id]);
  return result.rows[0];
};

// UPDATE
const updateReqIngredients = async (req_id, quantity) => {
  // Get original request
  const reqData = await pool.query("SELECT * FROM req_ingredients WHERE req_id = $1", [req_id]);
  if (reqData.rows.length === 0) throw new Error("Request not found");

  const recipe_no = reqData.rows[0].recipe_no;

  // Get recipe totals
  const recipeResult = await pool.query("SELECT * FROM recipe WHERE recipe_no = $1", [recipe_no]);
  const recipe = recipeResult.rows[0];

  const totals = {
    total_strawberry: recipe.strawberry * quantity,
    total_mango: recipe.mango * quantity,
    total_blueberry: recipe.blueberry * quantity,
    total_milk: recipe.milk * quantity,
    total_culture: recipe.culture * quantity,
    total_sugar: recipe.sugar * quantity,
    total_topping1: recipe.topping1 * quantity,
    total_topping2: recipe.topping2 * quantity,
    total_topping3: recipe.topping3 * quantity,
    total_bottom1: recipe.bottom1 * quantity,
    total_bottom2: recipe.bottom2 * quantity,
    total_bottom3: recipe.bottom3 * quantity,
  };

  const updated = await pool.query(
    `UPDATE req_ingredients SET
      quantity=$1, total_strawberry=$2, total_mango=$3, total_blueberry=$4, total_milk=$5, total_culture=$6, total_sugar=$7,
      total_topping1=$8, total_topping2=$9, total_topping3=$10, total_bottom1=$11, total_bottom2=$12, total_bottom3=$13
      WHERE req_id=$14 RETURNING *`,
    [
      quantity,
      totals.total_strawberry,
      totals.total_mango,
      totals.total_blueberry,
      totals.total_milk,
      totals.total_culture,
      totals.total_sugar,
      totals.total_topping1,
      totals.total_topping2,
      totals.total_topping3,
      totals.total_bottom1,
      totals.total_bottom2,
      totals.total_bottom3,
      req_id,
    ]
  );

  return updated.rows[0];
};

// NEW: update status only
const updateReqStatus = async (req_id, status) => {
  const { rows } = await pool.query(
    `UPDATE req_ingredients SET status = $1 WHERE req_id = $2 RETURNING *`,
    [status, req_id]
  );
  if (!rows.length) throw new Error("Request not found");
  return rows[0];
};

module.exports = {
  createReqIngredients,
  getAllReqIngredients,
  deleteReqIngredients,
  updateReqIngredients,
  updateReqStatus,
};
