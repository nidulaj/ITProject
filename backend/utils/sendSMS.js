require(".dotenv").config();
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (toPhone, code) => {
  try {
    const message = await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone
    });
    console.log("SMS sent successfully:", message.sid);
    return message;
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = sendSMS;
