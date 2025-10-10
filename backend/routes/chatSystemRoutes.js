const express = require("express");
const router = express.Router();
const {staffAuthMiddleware} = require("../middlewares/staffAuthMiddleware");
const { sendMessage, getUserMessages, getAllMessages, getUsers, markMessagesAsReadToAdminView, getUsersWithUnreadCount, getUnreadMessageCountByAdmin } = require("../controllers/chatSystemController");

router.post("/send", sendMessage);
router.get("/user/:user_code", getUserMessages);
router.get("/all", getAllMessages);
router.get("/users", getUsers);
router.put("/read/:user_code", markMessagesAsReadToAdminView);
router.get("/users-with-unread", getUsersWithUnreadCount);
router.get("/unread-count", staffAuthMiddleware, getUnreadMessageCountByAdmin);


module.exports = router;