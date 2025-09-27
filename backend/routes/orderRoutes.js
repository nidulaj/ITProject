const express = require('express');
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");
const { 
  createOrderController,
  getOrders, 
  getCustomerOrders, 
  getSingleOrder, 
  updateOrderStatusController, 
  updatePaymentStatusController,
  deleteOrderController
} = require('../controllers/orderController');

// Create new order
router.post('/', authMiddleware, createOrderController);

// Get all orders
router.get('/', getOrders);

// Get all orders (alternative endpoint)
router.get('/all', getOrders);

// Get orders by customer ID
router.get('/customer/:customer_id', authMiddleware, getCustomerOrders);

// Get single order by ID
router.get('/:order_id', authMiddleware, getSingleOrder);

// Update order status
router.put('/:order_id/status', updateOrderStatusController);

// Update payment status
router.put('/:order_id/payment', updatePaymentStatusController);

// Delete order
router.delete('/:order_id', authMiddleware, deleteOrderController);

module.exports = router;