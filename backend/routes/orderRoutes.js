const express = require('express');
const router = express.Router()
const { placeOrder, getCustomerOrders, changeOrderStatus, changePaymentStatus } = require('../controllers/orderController');



// Route to place an order
router.post('/', placeOrder);

// Route to get orders by customer
router.get('/:customer_id', getCustomerOrders);

// Route to update order status (for order handling staff)
router.put('/status', changeOrderStatus);

// Route to update payment status (for financial manager)
router.put('/payment', changePaymentStatus);

module.exports = router;
