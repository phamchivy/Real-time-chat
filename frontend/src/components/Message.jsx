const Message = ({ msg, currentUserId }) => {
    return (
        <div
            style={{
                textAlign: msg.sender === currentUserId ? "right" : "left",
            }}
        >
            <p
                style={{
                    backgroundColor: msg.sender === currentUserId ? "#daf" : "#eee",
                    display: "inline-block",
                    padding: "8px",
                    borderRadius: "8px",
                    maxWidth: "60%",
                }}
            >
                {msg.content}
            </p>
        </div>
    );
};

export default Message;
