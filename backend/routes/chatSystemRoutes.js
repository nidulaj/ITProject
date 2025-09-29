const express = require("express");
const router = express.Router();

const { sendMessage, getUserMessages, getAllMessages } = require("../controllers/chatSystemController");

router.post("/send", sendMessage);
router.get("/user/:user_code", getUserMessages);
router.get("/all", getAllMessages);

module.exports = router;