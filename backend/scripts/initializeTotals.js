const { pool } = require('../db/dbConnect');

async function initializeIngredientTotals() {
  try {
    console.log('Initializing ingredient totals...');
    
    // Use the database function to recalculate all totals
    await pool.query('SELECT recalculate_all_ingredient_totals()');
    
    // Get the results
    const result = await pool.query(`
      SELECT it.total_id, it.icode_id, it.total_quantity, it.last_updated,
             ic.ingredient_code, ic.name as icode_name
      FROM ingredient_totals it
      JOIN icode ic ON it.icode_id = ic.ingredient_id
      ORDER BY it.icode_id ASC
    `);
    
    console.log('Ingredient totals initialized successfully!');
    console.log('Totals created:', result.rows.length);
    
    if (result.rows.length > 0) {
      console.log('\nTotals:');
      result.rows.forEach(row => {
        console.log(`- ${row.ingredient_code} (${row.icode_name}): ${row.total_quantity}`);
      });
    } else {
      console.log('No ingredients found with icode_id. Make sure your ingredients have icode_id values.');
    }
    
  } catch (error) {
    console.error('Error initializing ingredient totals:', error);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeIngredientTotals();
