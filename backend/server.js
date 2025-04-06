const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { initSocket } = require("./config/socket");


const app = express();
const server = http.createServer(app);


initSocket(server);

// Cấu hình CORS
app.use(cors({
    origin: "http://localhost:5173",  // Cho phép frontend từ localhost:5173
    methods: ["GET", "POST","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json()); // Middleware để xử lý JSON

app.use('/api/users', userRoutes); // Đường dẫn API cho user

app.use('/api/message', messageRoutes);


const PORT = 5000;
server.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));

connectDB();