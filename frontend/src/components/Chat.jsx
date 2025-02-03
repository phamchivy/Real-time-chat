import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import InputBox from "./InputBox";
import MessageList from "./MessageList";
import axios from "axios";

const Chat = ({ userId, partnerId }) => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);

    // 📌 Đăng ký user khi kết nối socket thành công
    useEffect(() => {
        if (!socket) return;

        socket.emit("register-user", userId); // 🔥 Gửi userId lên server để đăng ký socketId

        return () => socket.off("register-user");
    }, [socket, userId]);

    // 📌 Nhận tin nhắn từ server
    useEffect(() => {
        if (!socket) return;

        socket.on("receive-message", (message) => {
            console.log("📩 Tin nhắn nhận từ server:", message); // Debug
            setMessages((prev) => [...prev, message]); // ✅ Hiển thị tin nhắn mới
        });

        return () => socket.off("receive-message");
    }, [socket]);

    // 📌 Lấy tin nhắn cũ từ server khi chat với một user khác
    useEffect(() => {
        axios.get(`http://localhost:5000/api/message/${userId}/${partnerId}`).then((res) => {
            setMessages(res.data);
        });
    }, [userId, partnerId]);

    return (
        <div>
            <h2>Chat</h2>
            <MessageList messages={messages} />
            <InputBox setMessages={setMessages} userId={userId} partnerId={partnerId}/>
        </div>
    );
};

export default Chat;
