import Message from "./Message";

const MessageList = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <Message key={index} msg={msg} />
            ))}
        </div>
    );
};

export default MessageList;
