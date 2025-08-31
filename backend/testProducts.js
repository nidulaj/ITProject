require('dotenv').config();
const { pool } = require('./db/dbConnect');

async function testProductsTable() {
  try {
    console.log('Environment variables:');
    console.log('DBHost:', process.env.DBHost);
    console.log('DBUser:', process.env.DBUser);
    console.log('DBPort:', process.env.DBPort);
    console.log('DBPassword:', process.env.DBPassword);
    console.log('DBDatabase:', process.env.DBDatabase);
    
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('Connected to database successfully!');
    
    console.log('Checking if products table exists...');
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'products'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('Products table exists!');
      
      console.log('Fetching products...');
      const result = await client.query('SELECT * FROM products LIMIT 5');
      console.log('Products found:', result.rows.length);
      console.log('Sample product:', result.rows[0]);
      
      if (result.rows[0]) {
        console.log('Product columns:', Object.keys(result.rows[0]));
      }
    } else {
      console.log('Products table does not exist!');
    }
    
    client.release();
  } catch (error) {
    console.error('Error testing products table:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

testProductsTable();