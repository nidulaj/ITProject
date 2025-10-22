// models/recipeModel.js
const { pool } = require("../db/dbConnect");

// helper: cast to int or null
const toIntOrNull = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

/**
 * Create recipe
 * NOTE:
 * - `order_no` is REQUIRED (FK to customized_odr.order_no)
 * - DO NOT send recipe_no; DB trigger generates it.
 */
const insertRecipe = async (
  order_no, recipe_name,
  strawberry, mango, blueberry, milk, culture, sugar,
  topping1, topping2, topping3, bottom1, bottom2, bottom3
) => {
  const q = `
    INSERT INTO public.recipe (
      order_no, recipe_name,
      strawberry, mango, blueberry,
      milk, culture, sugar,
      topping1, topping2, topping3,
      bottom1, bottom2, bottom3
    )
    VALUES (
      $1, $2,
      COALESCE($3, 0), COALESCE($4, 0), COALESCE($5, 0),
      COALESCE($6, 0), COALESCE($7, 0), COALESCE($8, 0),
      COALESCE($9, 0), COALESCE($10, 0), COALESCE($11, 0),
      COALESCE($12, 0), COALESCE($13, 0), COALESCE($14, 0)
    )
    RETURNING
      recipe_id, recipe_no, order_no, recipe_name,
      strawberry, mango, blueberry,
      milk, culture, sugar,
      topping1, topping2, topping3,
      bottom1, bottom2, bottom3
  `;

  const vals = [
    String(order_no).trim(),
    String(recipe_name).trim(),
    toIntOrNull(strawberry),
    toIntOrNull(mango),
    toIntOrNull(blueberry),
    toIntOrNull(milk),
    toIntOrNull(culture),
    toIntOrNull(sugar),
    toIntOrNull(topping1),
    toIntOrNull(topping2),
    toIntOrNull(topping3),
    toIntOrNull(bottom1),
    toIntOrNull(bottom2),
    toIntOrNull(bottom3),
  ];

  const { rows } = await pool.query(q, vals);
  return rows[0];
};

// Read all
const getAllRecipes = async () => {
  const { rows } = await pool.query(
    `SELECT
       recipe_id, recipe_no, order_no, recipe_name,
       strawberry, mango, blueberry, milk, culture, sugar,
       topping1, topping2, topping3, bottom1, bottom2, bottom3
     FROM public.recipe
     ORDER BY recipe_id DESC`
  );
  return rows;
};

/**
 * Update recipe
 * IMPORTANT:
 * - Do NOT update recipe_no (generated + referenced by other tables)
 * - You MAY allow changing order_no (FK), if you need to reassign the recipe.
 *   If not desired, remove order_no from the SET list.
 */
const updateRecipe = async (
  recipe_id,
  order_no, recipe_name,
  strawberry, mango, blueberry, milk, culture, sugar,
  topping1, topping2, topping3, bottom1, bottom2, bottom3
) => {
  const q = `
    UPDATE public.recipe
    SET
      order_no = $1,
      recipe_name = $2,
      strawberry = COALESCE($3, 0),
      mango      = COALESCE($4, 0),
      blueberry  = COALESCE($5, 0),
      milk       = COALESCE($6, 0),
      culture    = COALESCE($7, 0),
      sugar      = COALESCE($8, 0),
      topping1   = COALESCE($9, 0),
      topping2   = COALESCE($10, 0),
      topping3   = COALESCE($11, 0),
      bottom1    = COALESCE($12, 0),
      bottom2    = COALESCE($13, 0),
      bottom3    = COALESCE($14, 0)
    WHERE recipe_id = $15
    RETURNING
      recipe_id, recipe_no, order_no, recipe_name,
      strawberry, mango, blueberry,
      milk, culture, sugar,
      topping1, topping2, topping3,
      bottom1, bottom2, bottom3
  `;

  const vals = [
    String(order_no).trim(),
    String(recipe_name).trim(),
    toIntOrNull(strawberry),
    toIntOrNull(mango),
    toIntOrNull(blueberry),
    toIntOrNull(milk),
    toIntOrNull(culture),
    toIntOrNull(sugar),
    toIntOrNull(topping1),
    toIntOrNull(topping2),
    toIntOrNull(topping3),
    toIntOrNull(bottom1),
    toIntOrNull(bottom2),
    toIntOrNull(bottom3),
    Number(recipe_id),
  ];

  const { rows } = await pool.query(q, vals);
  return rows[0];
};

const deleteRecipe = async (recipe_id) => {
  const { rows } = await pool.query(
    'DELETE FROM public.recipe WHERE recipe_id = $1 RETURNING *',
    [Number(recipe_id)]
  );
  if (rows.length === 0) throw new Error('Recipe not found');
  return rows[0];
};

module.exports = { insertRecipe, getAllRecipes, updateRecipe, deleteRecipe };
