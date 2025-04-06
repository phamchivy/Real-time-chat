const Message = require("../models/message");
const mongoose = require("mongoose");

// 📌 Lấy lịch sử tin nhắn giữa 2 users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;  // Lấy userId từ tham số URL
        const currentUserId = req.user.id; // Giả sử bạn dùng middleware xác thực token và gán user vào req.user

        if (!currentUserId || !userId) {
            return res.status(400).json({ success: false, error: 'User ID không hợp lệ' });
        }

        // Tìm tất cả tin nhắn giữa người dùng hiện tại và người dùng đã chọn
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ timestamp: 1 }); // Sắp xếp theo thời gian

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getMessages };
