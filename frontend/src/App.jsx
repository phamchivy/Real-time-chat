import { useState } from "react";
import { SocketProvider } from "./context/SocketContext";
import Chat from "./components/Chat";

function App() {
    const [userId, setUserId] = useState("");
    const [partnerId, setPartnerId] = useState("");
    const [chatStarted, setChatStarted] = useState(false); // Trạng thái để bắt đầu chat

    const handleStartChat = () => {
        if (userId && partnerId) {
            setChatStarted(true); // Khi nhập đủ, hiển thị Chat component
        } else {
            alert("Vui lòng nhập đầy đủ User ID và Partner ID!");
        }
    };

    return (
        <SocketProvider>
            {!chatStarted ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <h1>Chat App</h1>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Nhập ID của bạn"
                    />
                    <br />
                    <input
                        type="text"
                        value={partnerId}
                        onChange={(e) => setPartnerId(e.target.value)}
                        placeholder="Nhập ID của đối phương"
                    />
                    <br />
                    <button onClick={handleStartChat}>Bắt đầu chat</button>
                </div>
            ) : (
                <Chat userId={userId} partnerId={partnerId} />
            )}
        </SocketProvider>
    );
}

export default App;
