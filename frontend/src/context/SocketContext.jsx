import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { token } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Kết nối socket và truyền token vào header
        const newSocket = io("http://localhost:5000", {
            transports: ["websocket"], // Chỉ sử dụng WebSocket
            auth: {
                token: `Bearer ${token}` // Truyền token vào auth
            },
        });
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        }; // Ngắt kết nối khi component bị hủy
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
