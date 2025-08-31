const { 
  createOrder,
  getAllOrders, 
  getOrdersByCustomer, 
  getOrderById, 
  updateOrderStatus, 
  updatePaymentStatus,
  deleteOrder
} = require('../models/orderModel');

// Create a new order
const createOrderController = async (req, res) => {
  try {
    const { customer_id, items } = req.body;
    
    console.log('Create order request:', { customer_id, items });
    
    if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID and items array are required' 
      });
    }
    
    // Calculate total price
    const total_price = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    console.log(`Creating order for customer ${customer_id} with total price: ${total_price}`);
    
    const newOrder = await createOrder(customer_id, total_price, items);
    
    console.log('Order created successfully:', newOrder);
    
    res.status(201).json({ 
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create order',
      details: error.message 
    });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    console.log('Fetching all orders from database...');
    const orders = await getAllOrders();
    console.log(`Retrieved ${orders.length} orders from database`);
    res.status(200).json({ 
      success: true,
      orders: orders,
      count: orders.length 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
};

// Get orders by customer ID
const getCustomerOrders = async (req, res) => {
  try {
    const { customer_id } = req.params;
    console.log(`Fetching orders for customer ID: ${customer_id}`);
    
    if (!customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID is required' 
      });
    }

    const orders = await getOrdersByCustomer(customer_id);
    console.log(`Retrieved ${orders.length} orders for customer ${customer_id}`);
    
    res.status(200).json({ 
      success: true,
      orders: orders,
      count: orders.length,
      customer_id: customer_id
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch customer orders',
      details: error.message 
    });
  }
};

// Get single order by ID
const getSingleOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    console.log(`Fetching order with ID: ${order_id}`);
    
    if (!order_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID is required' 
      });
    }

    const order = await getOrderById(order_id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Fetch order items
    let orderItems = [];
    try {
      orderItems = await getOrderItemsByOrderId(order_id);
      console.log(`Retrieved ${orderItems.length} items for order ${order_id}`);
    } catch (itemsError) {
      console.error('Error fetching order items, continuing with empty array:', itemsError);
      // Continue with empty items array
    }

    console.log(`Retrieved order: ${order.order_id}`);
    res.status(200).json({ 
      success: true,
      order: order,
      items: orderItems
    });
  } catch (error) {
    console.error('Error fetching single order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order',
      details: error.message 
    });
  }
};

// Update order status
const updateOrderStatusController = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { order_status } = req.body;
    
    console.log(`Updating order ${order_id} status to: ${order_status}`);
    
    if (!order_id || !order_status) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID and order status are required' 
      });
    }

    const updatedOrder = await updateOrderStatus(order_id, order_status);
    
    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    console.log(`Order status updated successfully: ${updatedOrder.order_id}`);
    res.status(200).json({ 
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order status',
      details: error.message 
    });
  }
};

// Update payment status
const updatePaymentStatusController = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { payment_status } = req.body;
    
    console.log(`Updating order ${order_id} payment status to: ${payment_status}`);
    
    if (!order_id || !payment_status) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID and payment status are required' 
      });
    }

    const updatedOrder = await updatePaymentStatus(order_id, payment_status);
    
    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    console.log(`Payment status updated successfully: ${updatedOrder.order_id}`);
    res.status(200).json({ 
      success: true,
      message: 'Payment status updated successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update payment status',
      details: error.message 
    });
  }
};

// Delete order
const deleteOrderController = async (req, res) => {
  try {
    const { order_id } = req.params;
    
    console.log(`Deleting order with ID: ${order_id}`);
    
    if (!order_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID is required' 
      });
    }

    const deletedOrder = await deleteOrder(order_id);
    
    if (!deletedOrder) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    console.log(`Order deleted successfully: ${deletedOrder.order_id}`);
    res.status(200).json({ 
      success: true,
      message: 'Order deleted successfully',
      order: deletedOrder 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete order',
      details: error.message 
    });
  }
};

module.exports = {
  createOrderController,
  getOrders,
  getCustomerOrders,
  getSingleOrder,
  updateOrderStatusController,
  updatePaymentStatusController,
  deleteOrderController
};