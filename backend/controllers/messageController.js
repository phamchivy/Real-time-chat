const Message = require("../models/message");
const mongoose = require("mongoose");

/*
// 📌 Gửi tin nhắn & lưu vào MongoDB
const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;
        const message = new Message({ sender, receiver, text });
        await message.save();
        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
*/

// 📌 Lấy lịch sử tin nhắn giữa 2 users
const getMessages = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        // Chuyển user1 và user2 thành ObjectId
        const user1Id = new mongoose.Types.ObjectId(user1);
        const user2Id = new mongoose.Types.ObjectId(user2);

        const messages = await Message.find({
            $or: [
                { sender: user1Id, receiver: user2Id },
                { sender: user2Id, receiver: user1Id }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getMessages };
