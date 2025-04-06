const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"], allowedHeaders: ["Authorization"], }
    });

    const userSocketMap = new Map(); // Lưu userId -> socketId

    // Middleware kiểm tra token khi kết nối
    io.use((socket, next) => {
        const token = socket.handshake.auth.token?.split(' ')[1]; // Lấy token từ header Authorization // Lấy token từ phần auth trong handshake

        if (!token) {
            console.log("❌ Không có token, từ chối kết nối");
            return next(new Error("Unauthorized")); // Nếu không có token, từ chối kết nối
        }

        try {
            // Xác thực token với JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.data.user = decoded; // Thêm thông tin người dùng vào socket
            return next(); // Kết nối tiếp tục
        } catch (err) {
            console.log("❌ Token không hợp lệ:", err.message);
            return next(new Error("Unauthorized")); // Nếu token không hợp lệ, từ chối kết nối
        }
    });

    io.on("connection", async (socket) => {
        const userId = socket.data.user.id;
        console.log(`✅ User connected: ${socket.id} - userId: ${userId}`);

        // 👉 Lưu mapping userId -> socketId
        await userSocketMap.set(userId, socket.id);
        console.log(userSocketMap);

        // 📌 Lắng nghe sự kiện "send-message" từ client
        socket.on("send-message", async ({ sender, receiver, content }) => {
            try {
                // Chuyển sender và receiver thành ObjectId
                //Lý do là mongoose.Types.ObjectId là một lớp và
                // cần phải được khởi tạo bằng từ khóa new để tạo một đối tượng ObjectId hợp lệ.
                const senderId = new mongoose.Types.ObjectId(sender);
                const receiverId = new mongoose.Types.ObjectId(receiver);

                // Lưu vào MongoDB
                const message = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    content
                });
                await message.save();

                // 📌 Tìm socket ID của người nhận
                const receiverSocketId = await userSocketMap.get(receiver.toString());
                // Gửi tin nhắn đến user nhận
                if (receiverSocketId) {
                    console.log("Gửi thông tin")
                    io.to(receiverSocketId).emit("receive-message", message);
                } else {
                    console.log(receiverSocketId);
                }
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            userSocketMap.forEach((value, key) => {
                if (value === socket.id) userSocketMap.delete(key);
            });
        });
    });
};

module.exports = { initSocket };
