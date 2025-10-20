const { 
  createOrder,
  getAllOrders, 
  getOrdersByCustomer, 
  getOrderById, 
  updateOrderStatus, 
  updatePaymentStatus,
  deleteOrder,
  getOrderItemsByOrderId
} = require('../models/orderModel');

const { createNotification } = require('../models/notificationModel');
const { getIo } = require('../utils/socket');
const { findUserById } = require('../models/customerAuthModel');
const PDFDocument = require('pdfkit');


// Create a new order
const createOrderController = async (req, res) => {
  try {
    const { customer_id, items, discount_id, discount_amount, delivery_address } = req.body;
    
    console.log('Create order request:', { customer_id, items, discount_id, discount_amount, delivery_address });
    
    if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer ID and items array are required' 
      });
    }
    
    // Calculate total price
    const subtotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    // Apply discount if provided
    const discountAmount = parseFloat(discount_amount) || 0;
    const total_price = subtotal - discountAmount;
    
    console.log(`Creating order for customer ${customer_id}:`);
    console.log(`- Subtotal: ${subtotal}`);
    console.log(`- Discount: ${discountAmount}`);
    console.log(`- Final total: ${total_price}`);
    console.log(`- Delivery address: ${delivery_address}`);
    
    const newOrder = await createOrder(customer_id, total_price, items, discount_id, discountAmount, delivery_address);
    
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
      orderItems: orderItems
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

    // Create notification for the customer
    console.log(`🔔 STARTING NOTIFICATION CREATION for order ${order_id} with status: ${order_status}`);
    console.log(`🔔 Updated order object:`, updatedOrder);
    console.log(`🔔 Customer ID from order: ${updatedOrder.cus_id}`);
    
    try {
      console.log(`🔔 Creating notification for order ${order_id} with status: ${order_status}`);
      console.log(`🔔 Customer ID: ${updatedOrder.cus_id}`);
      
      const notificationMessage = `Order #${String(order_id).padStart(3, '0')} is ${order_status.toLowerCase()}.`;
      console.log(`🔔 Notification message: ${notificationMessage}`);
      
      console.log(`🔔 About to call createNotification with:`, {
        cus_id: updatedOrder.cus_id,
        order_id: order_id,
        notification: notificationMessage,
        notification_type: 'order_update'
      });
      
      const notification = await createNotification(
        updatedOrder.cus_id,
        order_id,
        notificationMessage,
        'order_update'
      );
      
      console.log(`✅ Notification created successfully:`, notification);
      console.log(`📧 Notification sent to customer ${updatedOrder.cus_id} for order ${order_id}: ${notificationMessage}`);
      
      // Emit real-time notification via Socket.IO
      try {
        const io = getIo();
        io.to(`customer_${updatedOrder.cus_id}`).emit('new_notification', {
          notification: notification,
          message: notificationMessage,
          order_id: order_id,
          customer_id: updatedOrder.cus_id
        });
        console.log(`🚀 Real-time notification emitted to customer ${updatedOrder.cus_id}`);
      } catch (socketError) {
        console.error('❌ Error emitting socket notification:', socketError);
        // Don't fail the notification creation if socket fails
      }
    } catch (notificationError) {
      console.error('❌ Error creating notification:', notificationError);
      console.error('❌ Full error details:', notificationError);
      // Don't fail the order update if notification fails
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

// Generate PDF invoice for an order
const generateOrderInvoice = async (req, res) => {
  try {
    const { order_id } = req.params;
    console.log(`Generating PDF invoice for order ID: ${order_id}`);
    
    if (!order_id) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID is required' 
      });
    }

    // Get order details
    const order = await getOrderById(order_id);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Get order items
    let orderItems = await getOrderItemsByOrderId(order_id);
    console.log('Order items fetched:', orderItems);
    
    // Get product names for each item
    const { getProductById } = require('../models/productModel');
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      console.log(`Fetching product name for product ID: ${item.product_id}`);
      try {
        const product = await getProductById(item.product_id);
        console.log(`Product fetched for ID ${item.product_id}:`, product);
        item.product_name = product ? product.name : `Product ${item.product_id}`;
        console.log(`Set product name for item ${item.product_id}:`, item.product_name);
      } catch (error) {
        console.error(`Error fetching product name for ID ${item.product_id}:`, error);
        item.product_name = `Product ${item.product_id}`;
      }
    }
    
    console.log('Order items with product names:', orderItems);
    
    // Get customer information
    console.log(`Order customer ID: ${order.cus_id}`);
    const customer = await findUserById(order.cus_id);
    console.log(`Found customer:`, customer);
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : `Customer ${order.cus_id}`;
    console.log(`Customer name for PDF: ${customerName}`);
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order_id}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add header
    doc.fontSize(24)
       .fillColor('#2563eb')
       .text('INVOICE', 50, 50);
    
    // Add company info
    doc.fontSize(12)
       .fillColor('#374151')
       .text('PUBUD Yogurt', 50, 100)
       .text('Kaburupitiya, Mathara', 50, 115)
       .text('Phone: 0331232564', 50, 130)
       .text('Email: pubuduyogurt@gmail.com', 50, 145);
    
    // Add invoice details
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text(`Invoice #${order_id}`, 400, 100)
       .fontSize(12)
       .text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 400, 120)
       .text(`Status: ${order.order_status}`, 400, 135)
       .text(`Payment: ${order.payment_status}`, 400, 150);
    
    // Add customer info
    doc.fontSize(14)
       .fillColor('#1f2937')
       .text('Bill To:', 50, 200)
       .fontSize(12)
       .text(customerName, 50, 220);
    
    if (order.delivery_address) {
      doc.text(`Delivery Address: ${order.delivery_address}`, 50, 235);
    }
    
    // Add items table header
    const tableTop = 280;
    doc.fontSize(12)
       .fillColor('#1f2937')
       .text('Item', 50, tableTop)
       .text('Quantity', 300, tableTop)
       .text('Price', 400, tableTop)
       .text('Total', 500, tableTop);
    
    // Add line
    doc.moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();
    
    // Add order items
    let currentY = tableTop + 30;
    let subtotal = 0;
    
    orderItems.forEach((item, index) => {
      const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
      subtotal += itemTotal;
      
      const itemName = item.product_name || `Product ${item.product_id}`;
      console.log(`Adding item to PDF: ${itemName}`);
      
      doc.fontSize(10)
         .fillColor('#374151')
         .text(itemName, 50, currentY)
         .text(item.quantity.toString(), 300, currentY)
         .text(`LKR ${parseFloat(item.price).toFixed(2)}`, 400, currentY)
         .text(`LKR ${itemTotal.toFixed(2)}`, 500, currentY);
      
      currentY += 20;
    });
    
    // Add totals with better spacing
    const totalY = currentY + 30; // Add more space before totals
    doc.moveTo(400, totalY)
       .lineTo(550, totalY)
       .stroke();
    
    doc.fontSize(12)
       .fillColor('#1f2937')
       .text('Subtotal:', 400, totalY + 15)
       .text(`LKR ${subtotal.toFixed(2)}`, 500, totalY + 15);
    
    // Add discount if any with better formatting
    if (order.discount_amount && order.discount_amount > 0) {
      doc.fontSize(11)
         .fillColor('#dc2626') // Red color for discount
         .text('Discount:', 400, totalY + 40)
         .text(`-LKR ${parseFloat(order.discount_amount).toFixed(2)}`, 500, totalY + 40);
    }
    
    // Add total with better spacing and formatting
    const finalTotal = subtotal - (parseFloat(order.discount_amount) || 0);
    const totalStartY = order.discount_amount && order.discount_amount > 0 ? totalY + 65 : totalY + 40;
    
    doc.moveTo(400, totalStartY - 5)
       .lineTo(550, totalStartY - 5)
       .stroke();
    
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('Total:', 400, totalStartY + 5)
       .fontSize(16)
       .text(`LKR ${finalTotal.toFixed(2)}`, 500, totalStartY + 5);
    
    // Add footer
    const footerY = 750;
    doc.fontSize(10)
       .fillColor('#6b7280')
       .text('Thank you for your business!', 50, footerY)
       .text('Generated on: ' + new Date().toLocaleString(), 50, footerY + 15);
    
    // Finalize PDF
    doc.end();
    
    console.log(`PDF invoice generated successfully for order ${order_id}`);
    
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate PDF invoice',
      details: error.message 
    });
  }
};

// Generate order summary report as PDF
const generateOrderSummaryReport = async (req, res) => {
  try {
    console.log('Generating order summary report...');
    
    // Get all orders
    const orders = await getAllOrders();
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="order-summary-report.pdf"');
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add header
    doc.fontSize(24)
       .fillColor('#2563eb')
       .text('ORDER SUMMARY REPORT', 50, 50);
    
    // Add company info
    doc.fontSize(12)
       .fillColor('#374151')
       .text('PUBUD Yogurt', 50, 100)
       .text('Kaburupitiya, Mathara', 50, 115)
       .text('Phone: 0331232564', 50, 130)
       .text('Email: pubuduyogurt@gmail.com', 50, 145);
    
    // Add report details
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text(`Report Date: ${new Date().toLocaleDateString()}`, 400, 100)
       .fontSize(12)
       .text(`Generated: ${new Date().toLocaleString()}`, 400, 130);
    
    // Add summary statistics
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    const pendingOrders = orders.filter(order => order.order_status === 'pending').length;
    const deliveredOrders = orders.filter(order => order.order_status === 'delivered').length;
    const outForDeliveryOrders = orders.filter(order => order.order_status === 'out for delivery').length;
    
    doc.fontSize(14)
       .fillColor('#1f2937')
       .text('Summary Statistics:', 50, 180)
       .fontSize(12)
       .text(`Total Revenue: LKR ${totalRevenue.toFixed(2)}`, 50, 205)
       .text(`Pending Orders: ${pendingOrders}`, 50, 225)
       .text(`Out for Delivery: ${outForDeliveryOrders}`, 50, 245)
       .text(`Delivered: ${deliveredOrders}`, 50, 265);
    
    // Add orders table header
    const tableTop = 300;
    doc.fontSize(12)
       .fillColor('#1f2937')
       .text('Order ID', 50, tableTop)
       .text('Customer', 120, tableTop)
       .text('Date', 200, tableTop)
       .text('Status', 280, tableTop)
       .text('Payment', 360, tableTop)
       .text('Total', 440, tableTop);
    
    // Add line
    doc.moveTo(50, tableTop + 20)
       .lineTo(520, tableTop + 20)
       .stroke();
    
    // Add order rows
    let currentY = tableTop + 35;
    
    // Process orders in batches to avoid async issues
    for (let i = 0; i < Math.min(orders.length, 15); i++) {
      const order = orders[i];
      if (currentY > 650) break; // Prevent overflow
      
      // Get customer name
      let customerName = `Customer ${order.cus_id}`;
      try {
        const customer = await findUserById(order.cus_id);
        if (customer) {
          customerName = `${customer.first_name} ${customer.last_name}`;
        }
      } catch (error) {
        console.log('Could not fetch customer name for order', order.order_id);
      }
      
      doc.fontSize(10)
         .fillColor('#374151')
         .text(`#${order.order_id}`, 50, currentY)
         .text(customerName.substring(0, 15), 120, currentY) // Truncate long names
         .text(new Date(order.order_date).toLocaleDateString(), 200, currentY)
         .text(order.order_status, 280, currentY)
         .text(order.payment_status, 360, currentY)
         .text(`LKR ${parseFloat(order.total_price || 0).toFixed(2)}`, 440, currentY);
      
      currentY += 20;
    }
    
    // Add footer
    const footerY = 750;
    doc.fontSize(10)
       .fillColor('#6b7280')
       .text('Generated by PUBUD Yogurt Order Management System', 50, footerY)
       .text(`Report contains ${orders.length} orders`, 50, footerY + 15);
    
    // Finalize PDF
    doc.end();
    
    console.log(`Order summary report generated successfully with ${orders.length} orders`);
    
  } catch (error) {
    console.error('Error generating order summary report:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate order summary report',
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
  deleteOrderController,
  generateOrderInvoice,
  generateOrderSummaryReport
};