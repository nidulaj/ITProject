const {
  createMessage,
  getMessagesByUserCode,
  getAll,
  getUniqueUsers,
  createMessageByAdmin,
  markMessagesAsReadToAdmin,
  getUsersWithUnread,
  getUnreadMessageCount
} = require("../models/chatSystemModel");
const { getIo } = require("../utils/socket");

const sendMessage = async (req, res) => {
  try {
    const { user_code, sender, message } = req.body;
    if (!user_code || !sender || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let newMessage;
    if (sender === "admin") {
      newMessage = await createMessageByAdmin({ user_code, sender, message });
    } else {
      newMessage = await createMessage({ user_code, sender, message });
    }

    getIo().to(user_code).emit("receive_message", newMessage);
    if (sender === "user") {
      getIo().to("admin").emit("receive_message", newMessage);
    }
    if (sender === "admin") {
      getIo().to("user").emit("receive_message", newMessage);
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

const getAllMessages = async (req, res) => {
  try {
    const messages = await getAll();
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching all messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getUniqueUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const markMessagesAsReadToAdminView = async (req, res) => {
  try {
    const { user_code } = req.params;
    await markMessagesAsReadToAdmin(user_code);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUsersWithUnreadCount = async (req, res) => {
  try {
    const users = await getUsersWithUnread();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users with unread count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUnreadMessageCountByAdmin = async (req, res) => {
  try {
    const count = await getUnreadMessageCount();
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching unread message count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendMessage,
  getUserMessages,
  getAllMessages,
  getUsers,
  markMessagesAsReadToAdminView,
  getUsersWithUnreadCount,
  getUnreadMessageCountByAdmin
};
