const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
//const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { initSocket } = require("./config/socket");


const app = express();
const server = http.createServer(app);
//const io = socketIo(server);

initSocket(server);

app.use(express.json()); // Middleware để xử lý JSON

app.use('/api/users', userRoutes); // Đường dẫn API cho user

app.use('/api/message', messageRoutes);

/*
io.on('connection', (socket) => {
    console.log('A user connected');

    // Lắng nghe sự kiện send-message từ client (Postman)
    socket.on('send-message', (data) => {
        console.log('Received message:', data); // In ra tin nhắn nhận được
        // Gửi phản hồi lại client
        socket.emit('receive-message', { message: 'Message received: ' + data });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
*/


const PORT = 5000;
server.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));

connectDB();