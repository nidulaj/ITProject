const Payment = require("../models/paymentModel");
const { pool } = require("../db/dbConnect");
const { sendImmediatePaymentStatusEmail } = require("../utils/emailService");

const addPayment = async (req, res) => {
  try {
    const { order_id, customer_name, amount, payment_date } = req.body;
    const payment_proof = req.file ? req.file.filename : null;

    console.log('Payment controller received:', {
      order_id,
      customer_name,
      amount,
      payment_date,
      payment_proof
    });
    
    console.log('Full request body:', req.body);
    console.log('Request headers:', req.headers);

    if (!customer_name || !amount || !payment_date) {
      return res.status(400).json({ message: "Customer name, amount, and payment date are required" });
    }

    const payment_status = "pending";

    const payment = await Payment.createPayment(
      order_id,
      customer_name,
      amount,
      payment_status,
      payment_date,
      payment_proof
    );

    res.status(201).json({ message: "Payment added successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error adding payment", error: error.message });
  }
};


const getPayments = async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};


const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`🔄 Payment status update request: ID=${id}, Status=${status}`);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);

  try {
    const result = await pool.query(
      `UPDATE payments SET payment_status = $1 WHERE payment_id = $2 RETURNING *`,
      [status, Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    const updatedPayment = result.rows[0];

    const nameParts = updatedPayment.customer_name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

let customerEmailResult;

if (lastName) {
  
  customerEmailResult = await pool.query(
    `SELECT email FROM customers 
     WHERE LOWER(first_name) = LOWER($1)
     AND LOWER(last_name) = LOWER($2)
     LIMIT 1`,
    [firstName, lastName]
  );
} else {
  
  customerEmailResult = await pool.query(
    `SELECT email FROM customers 
     WHERE LOWER(first_name) = LOWER($1)
     LIMIT 1`,
    [firstName]
  );
}

    console.log("Customer email query result:", customerEmailResult.rows);
    console.log("Searching for customer with name:", updatedPayment.customer_name);
    console.log("Parsed firstName:", firstName, "lastName:", lastName);

    if (customerEmailResult.rows.length > 0) {
      const customerEmail = customerEmailResult.rows[0].email;
      console.log(`Found customer email: ${customerEmail}`);

      // ✅ Send email when approved, completed, or declined (asynchronous, non-blocking)
      if (status === "approved" || status === "completed" || status === "Completed" || status === "declined" || status === "Declined") {
        console.log(`📧 EMAIL TRIGGER: Status is ${status}, sending email to ${customerEmail} asynchronously`);
        console.log(`📧 Email details:`, {
          email: customerEmail,
          customerName: updatedPayment.customer_name,
          amount: updatedPayment.amount,
          orderId: updatedPayment.order_id,
          status: status
        });
        
        // Send email asynchronously without blocking the response
        setImmediate(async () => {
          try {
            await sendImmediatePaymentStatusEmail(
              customerEmail,
              updatedPayment.customer_name,
              updatedPayment.amount,
              updatedPayment.order_id,
              status
            );
            console.log(`✅ Immediate payment status email sent successfully to ${customerEmail}`);
          } catch (emailError) {
            console.error(`❌ Failed to send immediate email to ${customerEmail}:`, emailError);
          }
        });
      } else {
        console.log(`📧 EMAIL SKIPPED: Status is ${status}, not approved or declined`);
      }
    } else {
      console.log("No customer email found for payment - using fallback email");
      
      // ✅ FALLBACK: Send email to a default address for demonstration (asynchronous)
      if (status === "approved" || status === "completed" || status === "Completed" || status === "declined" || status === "Declined") {
        const fallbackEmail = "minulijayasinghe04@gmail.com"; // Your email for demo
        console.log(`📧 FALLBACK EMAIL: Sending to ${fallbackEmail} for demonstration asynchronously`);
        
        // Send fallback email asynchronously without blocking the response
        setImmediate(async () => {
          try {
            await sendImmediatePaymentStatusEmail(
              fallbackEmail,
              updatedPayment.customer_name,
              updatedPayment.amount,
              updatedPayment.order_id,
              status
            );
            console.log(`✅ Immediate fallback email sent successfully to ${fallbackEmail}`);
          } catch (emailError) {
            console.error(`❌ Failed to send immediate fallback email:`, emailError);
          }
        });
      }
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status." });
  }
};




module.exports = {
  addPayment,
  getPayments,
  updatePaymentStatus,
};


