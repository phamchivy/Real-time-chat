const express = require("express");
const { getMessages } = require("../controllers/messageController");

const router = express.Router();

//router.post("/send", sendMessage); // API gửi tin nhắn
router.get("/:user1/:user2", getMessages); // API lấy lịch sử chat

module.exports = router;
