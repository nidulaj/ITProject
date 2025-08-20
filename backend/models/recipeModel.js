const { pool } = require("../db/dbConnect");

const insertRecipe = async (
    recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
    topping1, topping2, topping3, bottom1, bottom2, bottom3) => {
  const query = `
    INSERT INTO recipe (
        recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
        topping1, topping2, topping3, bottom1, bottom2, bottom3
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *;
  `;

  const values = [recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar,
        topping1, topping2, topping3, bottom1, bottom2, bottom3];

  const result = await pool.query(query, values);
  return result.rows[0];
};


// Get all recipies (optional, but useful for viewing recipies)
const getAllRecipes = async () => {
  try {
    const result = await pool.query('SELECT * FROM recipe');
    return result.rows;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};


// Update a recipe in the database
const updateRecipe = async (recipe_id, recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar, topping1, topping2, topping3, bottom1, bottom2, bottom3) => {
  try {
    const result = await pool.query(
      'UPDATE recipe SET recipe_no=$1, recipe_name=$2, strawberry=$3, mango=$4, blueberry=$5, milk=$6, culture=$7, sugar=$8, topping1=$9, topping2=$10, topping3=$11, bottom1=$12, bottom2=$13, bottom3=$14 WHERE recipe_id=$15 RETURNING *',
      [recipe_no, recipe_name, strawberry, mango, blueberry, milk, culture, sugar, topping1, topping2, topping3, bottom1, bottom2, bottom3, recipe_id]  // Include the recipe_id for which the product will be updated
    );
    return result.rows[0];  // Return the updated recipe
  } catch (error) {
    console.error('Error updating recipe:', error.message);
    console.error(error.stack);
    throw error;
  }
};


//delete
const deleteRecipe = async (recipe_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM recipe WHERE recipe_id = $1 RETURNING *',
      [recipe_id]  // Use the recipe_no to delete the correct recipe
    );

    if (result.rows.length === 0) {
      throw new Error('Recipe not found');  // If no recipe was deleted
    }

    return result.rows[0];  // Return the deleted recipe (optional)
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    throw error;  // Rethrow the error to handle it in the controller
  }
};


module.exports = { insertRecipe, getAllRecipes, updateRecipe, deleteRecipe};

