// controllers/productController.js

const { createOrder, getOrdersByCustomer, updateOrderStatus, updatePaymentStatus } = require('../models/orderModel');

// Function to place an order
const placeOrder = async (req, res) => {
  const { customer_id, items } = req.body;

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer ID and items are required' });
  }

  let total_price = 0;
  for (const item of items) {
    total_price += item.quantity * item.price;
  }

  try {
    const order = await createOrder(customer_id, total_price, items);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get orders for a customer
const getCustomerOrders = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const orders = await getOrdersByCustomer(customer_id);
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to change order status (for order handling staff)
const changeOrderStatus = async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const updatedOrder = await updateOrderStatus(order_id, status);
    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to change payment status (for financial manager)
const changePaymentStatus = async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const updatedPayment = await updatePaymentStatus(order_id, status);
    res.status(200).json({ message: 'Payment status updated', payment: updatedPayment });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { placeOrder, getCustomerOrders, changeOrderStatus, changePaymentStatus };
