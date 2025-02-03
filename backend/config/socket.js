const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("../models/message");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
    }); 

    const userSocketMap = new Map(); // Lưu userId -> socketId

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("register-user", async(userId) => {
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            await userSocketMap.set(userId.toString(), socket.id);
            console.log(userSocketMap);
        });

        // 📌 Lắng nghe sự kiện "send-message" từ client
        socket.on("send-message", async ({ sender, receiver, text }) => {
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
                    content: text
                });
                await message.save();

                // 📌 Tìm socket ID của người nhận
                const receiverSocketId = await userSocketMap.get(receiver.toString());
                // Gửi tin nhắn đến user nhận
                if (receiverSocketId) {
                    console.log("Gửi thông tin")
                    io.to(receiverSocketId).emit("receive-message", message);
                }else {
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
