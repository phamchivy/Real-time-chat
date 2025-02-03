import { useState } from "react";
import { useSocket } from "../context/SocketContext";

const InputBox = ({ setMessages,userId, partnerId }) => {
    const [content, setText] = useState("");
    const socket = useSocket();
    const sender = userId; // Tạm thời fix user ID
    const receiver = partnerId;

    const sendMessage = () => {
        if (!content || !socket) return;

        const message = {
            sender,  // Gửi ID dạng string, không dùng Mongoose
            receiver,
            text: content
        };

        socket.emit("send-message", message); // Gửi lên server
        setMessages((prev) => [...prev, message]); // Hiển thị ngay
        setText("");
    };

    return (
        <div>
            <input
                type="text"
                value={content}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
        </div>
    );
};

export default InputBox;
