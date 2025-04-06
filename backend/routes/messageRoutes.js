const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const { getMessages } = require("../controllers/messageController");

const router = express.Router();

router.get('/:userId', authMiddleware, getMessages); // API lấy lịch sử chat

module.exports = router;
