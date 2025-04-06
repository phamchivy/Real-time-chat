// src/pages/ChatPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, getUserProfile } from "../api/userAPI";
import { getMessagesWithUser } from "../api/messageAPI";
import { useSocket } from "../context/SocketContext";
import UserSidebar from "../components/UserSidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const ChatPage = () => {
    const socket = useSocket();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null); // ✅ Thêm state

    const { token } = useAuth(); // Lấy token từ AuthContext
    if (!token) return;

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await getUserProfile(token);
                const user = res.data; // hoặc res.data tùy theo bạn trả từ backend
                setCurrentUserId(user._id); // ✅ Lưu ID vào state
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            }
        };
        fetchCurrentUser();
    }, []);
    // Lấy danh sách người dùng từ server
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers(token); // token lấy từ context hoặc localStorage
                setUsers(res.data.filter(u => u._id !== currentUserId));
            } catch (err) {
                console.error("Lỗi khi lấy danh sách người dùng:", err);
            }
        };
        fetchUsers();
    }, [currentUserId, token]);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const res = await getMessagesWithUser(token, selectedUser._id);
                setMessages(res.data.messages);
            } catch (err) {
                console.error("Lỗi khi lấy tin nhắn:", err);
            }
        };

        fetchMessages();
    }, [selectedUser, token]);

    // Nhận tin nhắn realtime
    useEffect(() => {
        if (!socket) return;

        socket.on("receive-message", (message) => {
            if (
                message.sender === selectedUser?._id ||
                message.receiver === selectedUser?._id
            ) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("receive-message");
        };
    }, [socket, selectedUser]);

    // Gửi tin nhắn
    const handleSend = () => {
        if (!newMessage || !selectedUser || !socket) return; // Kiểm tra điều kiện đầu vào

        const sender = currentUserId; // Tạm thời fix user ID
        const receiver = selectedUser._id;

        // Tạo đối tượng message
        const message = {
            sender,          // ID người gửi
            receiver,     // ID người nhận
            content: newMessage,            // Nội dung tin nhắn
        };

        // Cập nhật tin nhắn vào UI ngay lập tức
        setMessages((prev) => [...prev, message]);

        // Gửi tin nhắn lên server thông qua socket
        socket.emit("send-message", message);

        // Xóa nội dung tin nhắn sau khi gửi
        setNewMessage("");
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar: danh sách user */}
            <UserSidebar
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />

            {/* Chat box */}
            <div style={{ flex: 1, padding: "1rem" }}>
                {selectedUser ? (
                    <>
                        <h3>Đang chat với: {selectedUser.username}</h3>
                        <MessageList messages={messages} currentUserId={currentUserId} />
                        <MessageInput
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSend={handleSend}
                        />
                    </>
                ) : (
                    <p>Hãy chọn một người dùng để bắt đầu trò chuyện</p>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
