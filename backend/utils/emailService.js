const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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

const sendOrderStatusEmail = async (userEmail, orderId, status) => {
  try {
    await transporter.sendMail({
      from: `"Smart Dairy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Your Order #${orderId} Status Update`,
      text: `Dear Customer,\n\nYour Customized order status has been updated to: ${status}.\n\nThank you for shopping with us!\nPubudu Yoghurt`,
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = {
  send2FACode,
  sendVerificationLink,
  sendResetPasswordLink,
  sendStaffRegistrationInfo,
  sendOrderStatusEmail,
};
