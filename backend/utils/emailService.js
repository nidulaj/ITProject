const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 5000, 
  greetingTimeout: 5000,
  socketTimeout: 5000, 
  pool: false,
  maxConnections: 1, 
  maxMessages: 1,
  rateDelta: 0, 
  rateLimit: 0
});


transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email transporter is ready to send emails");
  }
});



const send2FACode = async (email, code) => {
  await transporter.sendMail({
    from: `"Smart Dairy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your 2FA Code",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Smart Dairy Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #2563eb; /* bg-blue-600 */
      color: #ffffff;
      padding: 16px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      padding: 10px 16px;
      margin-top: 16px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #777777;
      padding: 12px;
      border-top: 1px solid #eeeeee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Smart Dairy</div>
    <div class="content">
      <p>Hello,</p>
      <p>Your 2FA verification code is:</p>
      <h2 style="color:#2563eb; text-align:center;">${code}</h2>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 Smart Dairy. All rights reserved.
    </div>
  </div>
</body>
</html>
`,
  });
};

const sendVerificationLink = async (email, verificationLink) => {
  await transporter.sendMail({
    from: `"Smart Dairy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          background-color: #2563eb; /* bg-blue-600 */
          color: #ffffff;
          padding: 16px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          padding: 10px 16px;
          margin-top: 16px;
          background-color: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          padding: 12px;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Smart Dairy</div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for registering with Smart Dairy. Please verify your email by clicking the button below:</p>
          <p style="text-align:center;">
            <a href="${verificationLink}" class="btn">Verify Email</a>
          </p>
          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
        </div>
        <div class="footer">
          &copy; 2025 Smart Dairy. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
  });
};

const sendResetPasswordLink = async (email, resetToken, type) => {
  // Decide which reset URL to use (customer vs staff)
  const resetUrl =
    type === "customer"
      ? `http://localhost:5173/reset-password?token=${resetToken}`
      : `http://localhost:5173/reset-password-staff?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Smart Dairy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          background-color: #2563eb; /* Tailwind's blue-600 */
          color: #ffffff;
          padding: 16px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          padding: 10px 16px;
          margin-top: 16px;
          background-color: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          padding: 12px;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Smart Dairy</div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <p style="text-align:center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </p>
          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you didn’t request a password reset, please ignore this email. Your account will remain secure.</p>
        </div>
        <div class="footer">
          &copy; 2025 Smart Dairy. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
  });
};


const sendStaffRegistrationInfo = async (email, password) => {
  await transporter.sendMail({
    from: `"Smart Dairy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Staff Registration",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Staff Registration</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          background-color: #2563eb; /* bg-blue-600 */
          color: #ffffff;
          padding: 16px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
        }
        .highlight {
          background-color: #f1f5f9;
          border-left: 4px solid #2563eb;
          padding: 10px;
          margin: 12px 0;
          border-radius: 4px;
          font-family: monospace;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          padding: 12px;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Smart Dairy</div>
        <div class="content">
          <p>Hello,</p>
          <p>Your staff account has been created successfully.</p>
          <p>Use the following credentials to log in:</p>
          <div class="highlight">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p>Please change your password after your first login for security purposes.</p>
        </div>
        <div class="footer">
          &copy; 2025 Smart Dairy. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
  });
};

//rashmika
const sendOrderStatusEmail = async (userEmail, orderId, status) => {
  try {
    await transporter.sendMail({
      from: `"Smart Dairy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Your Order #${orderId} Status Update`,
      text: `Dear Customer,\n\nYour Customized order status has been updated to: ${status}.\n\nThank you for shopping with us!\nPubudu Yoghurt`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Order Status Update</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }
          .header {
            background-color: #2563eb;
            color: #ffffff;
            padding: 16px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }
          .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
          }
          .highlight {
            background-color: #f1f5f9;
            border-left: 4px solid #2563eb;
            padding: 10px;
            margin: 12px 0;
            border-radius: 4px;
            font-family: monospace;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 12px;
            border-top: 1px solid #eeeeee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Smart Dairy</div>
          <div class="content">
            <p>Dear Customer,</p>
            <p>Your customized yoghurt order has been updated.</p>
            <div class="highlight">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Status:</strong> ${status}</p>
            </div>
            <p>Thank you for shopping with us!</p>
            <p>Pubudu Yoghurt</p>
          </div>
          <div class="footer">
            &copy; 2025 Smart Dairy. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `,
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};


const sendPaymentStatusEmail = async (email, customerName, amount, orderId, status) => {

  return sendImmediatePaymentStatusEmail(email, customerName, amount, orderId, status);

};

// Optimized function for immediate payment status emails
const sendImmediatePaymentStatusEmail = async (email, customerName, amount, orderId, status) => {
  try {
    console.log(`Sending immediate payment status email:`, {
      email,
      customerName,
      amount,
      orderId,
      status
    });

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER or EMAIL_PASS environment variables are not set");
    }

    let subject, message;

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "approved" || normalizedStatus === "completed") {
      subject = "Your Payment Has Been Approved ✅";
      message = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color:#16a34a;text-align:center;">Payment Approved</h2>
            <p>Dear ${customerName},</p>
            <p>Your payment of <strong>LKR ${amount}</strong> for Order ID <strong>${orderId}</strong> has been approved.</p>
            <p>Thank you for choosing Smart Dairy!</p>
            <p style="color:#6b7280;font-size:12px;text-align:center;">&copy; 2025 Smart Dairy. All rights reserved.</p>
          </div>
        </body>
        </html>`;

    } else if (normalizedStatus === "declined") {
      subject = "Your Payment Has Been Declined ❌";
      message = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color:#dc2626;text-align:center;">Payment Declined</h2>
            <p>Dear ${customerName},</p>
            <p>Your payment of <strong>LKR ${amount}</strong> for Order ID <strong>${orderId}</strong> has been declined.</p>
            <p>If you believe this is an error, please contact our Finance Team.</p>
            <p style="color:#6b7280;font-size:12px;text-align:center;">&copy; 2025 Smart Dairy. All rights reserved.</p>
          </div>
        </body>
        </html>`;

    } else {
      
      subject = `Your Payment Status Update - ${status}`;
      message = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color:#2563eb;text-align:center;">Payment Status Update</h2>
            <p>Dear ${customerName},</p>
            <p>Your payment of <strong>LKR ${amount}</strong> for Order ID <strong>${orderId}</strong> status has been updated to: <strong>${status}</strong>.</p>
            <p>Thank you for choosing Smart Dairy!</p>
            <p style="color:#6b7280;font-size:12px;text-align:center;">&copy; 2025 Smart Dairy. All rights reserved.</p>
          </div>
        </body>
        </html>`;
    }

    
    const immediateTransporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 2000, 
      greetingTimeout: 2000,
      socketTimeout: 2000,
      pool: false, 
    });

    // Send email with immediate delivery settings
    const mailOptions = {
      from: `"Smart Dairy Finance" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
      priority: 'high', 
      headers: {
        'X-Priority': '1', 
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    await immediateTransporter.sendMail(mailOptions);
    immediateTransporter.close();

    console.log(`✅ Immediate payment status email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Error sending immediate payment status email:`, err);
    throw err;
  }
};

module.exports = {
  send2FACode,
  sendVerificationLink,
  sendResetPasswordLink,
  sendStaffRegistrationInfo,
  sendOrderStatusEmail,
  sendPaymentStatusEmail,
  sendImmediatePaymentStatusEmail,
};
