const Message = ({ msg }) => {
    console.log("Dữ liệu tin nhắn nhận được:", msg);
    return (
        <div>
            <strong>{msg.sender}:</strong> {msg.content}
        </div>
    );
};

export default Message;
