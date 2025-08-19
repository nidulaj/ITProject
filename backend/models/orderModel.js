const { pool } = require('../db/dbConnect');

// Create a new order
const createOrder = async (customer_id, total_price, items) => {
  try {
    // Create the order
    const result = await pool.query(
      'INSERT INTO orders (customer_id, total_price, order_status, payment_status) VALUES ($1, $2, $3, $4) RETURNING *',
      [customer_id, total_price, 'pending', 'pending']  // Default statuses
    );
    const order = result.rows[0];

    // Add the items to the order
    await createOrderItems(order.order_id, items);

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Create order items
const createOrderItems = async (order_id, items) => {
  try {
    const promises = items.map(item =>
      pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [order_id, item.product_id, item.quantity, item.price]
      )
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Error adding order items:', error);
    throw error;
  }
};

// Get orders for a customer
const getOrdersByCustomer = async (customer_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE customer_id = $1',
      [customer_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Update order status (for order handling staff)
const updateOrderStatus = async (order_id, status) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *',
      [status, order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update payment status (handled by financial manager)
const updatePaymentStatus = async (order_id, status) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET payment_status = $1 WHERE order_id = $2 RETURNING *',
      [status, order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

module.exports = { createOrder, getOrdersByCustomer, updateOrderStatus, updatePaymentStatus };
