const {createMessage, getMessagesByUserCode, getAll} = require("../models/chatSystemModel");
const { getIo } = require("../utils/socket");

const sendMessage  = async (req, res) => {
  try {
    const { user_code, sender, message } = req.body;
    if (!user_code || !sender || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newMessage = await createMessage({ user_code, sender, message });

    getIo().to(user_code).emit("receive_message", newMessage);
    if (sender === "customer") {
      getIo().to("admin").emit("receive_message", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const { user_code } = req.params;
    const messages = await getMessagesByUserCode(user_code);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMessages  = async (req, res) => {
  try {
    const messages = await getAll();
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching all messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getUserMessages, getAllMessages };
