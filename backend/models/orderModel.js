const { pool } = require('../db/dbConnect');

// Create a new order
const createOrder = async (customer_id, total_price, items) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create the order
    const orderResult = await client.query(
      'INSERT INTO orders (customer_id, total_price, order_status, payment_status, order_date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [customer_id, total_price, 'pending', 'pending']
    );
    
    const order = orderResult.rows[0];
    console.log('Order created:', order);
    
    // Insert order items if there's an order_items table
    if (items && items.length > 0) {
      for (const item of items) {
        try {
          await client.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [order.order_id, item.product_id, item.quantity, item.price]
          );
        } catch (itemError) {
          console.log('Order items table might not exist, skipping item insertion:', itemError.message);
          // Continue without order_items if table doesn't exist
        }
      }
    }
    
    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Get all orders from the database
const getAllOrders = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY order_date DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// Get orders by customer ID
const getOrdersByCustomer = async (customer_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC',
      [customer_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching orders by customer:', error);
    throw error;
  }
};

// Get order by ID
const getOrderById = async (order_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1',
      [order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

// Update order status
const updateOrderStatus = async (order_id, order_status) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *',
      [order_status, order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update payment status
const updatePaymentStatus = async (order_id, payment_status) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET payment_status = $1 WHERE order_id = $2 RETURNING *',
      [payment_status, order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Delete order
const deleteOrder = async (order_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM orders WHERE order_id = $1 RETURNING *',
      [order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
};