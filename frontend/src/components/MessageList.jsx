import Message from "./Message";

const MessageList = ({ messages, currentUserId }) => {
    return (
        <div
            style={{
                height: "70vh",
                overflowY: "scroll",
                border: "1px solid #ddd",
                padding: "1rem",
                marginBottom: "1rem",
            }}
        >
            {messages.map((msg, idx) => (
                <Message key={idx} msg={msg} currentUserId={currentUserId} />
            ))}
        </div>
    );
};

export default MessageList;
