const MessageInput = ({ newMessage, setNewMessage, handleSend }) => {
    return (
        <div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                style={{ width: "80%", padding: "8px" }}
            />
            <button onClick={handleSend} style={{ padding: "8px" }}>
                Gửi
            </button>
        </div>
    );
};

export default MessageInput;
