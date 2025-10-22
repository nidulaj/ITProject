const { listAll } = require('../models/customizedOrderModel'); // Import the function to fetch orders

// Format the notifications
const formatNotifications = (orders) => {
  return orders.map((order) => {
    return {
      id: order.id,
      message: `${order.order_no} from ${order.customer_name} likes to order ${order.quantity} yoghurts with ${order.fruit}, ${order.topping}, and ${order.bottom}.`,
      timeAgo: new Date(order.order_date).toLocaleDateString(),
    };
  });
};

// Fetch and format notifications for pending orders only
const getNotifications = async () => {
  try {
    const orders = await listAll(); // Fetch all orders
    const pendingOrders = orders.filter(order => order.status === 'pending'); // Filter out only 'pending' orders
    return formatNotifications(pendingOrders); // Return formatted notifications for pending orders
  } catch (error) {
    throw new Error('Failed to fetch notifications: ' + error.message);
  }
};

module.exports = { getNotifications };
