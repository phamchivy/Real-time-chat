import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../api/userAPI"; 
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    // 🔄 Khi ứng dụng chạy, kiểm tra token và lấy lại user
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await getUserProfile(token);
                    setUser(response.data);
                } catch {
                    setToken(null);
                    localStorage.removeItem("token");
                }
            }
        };
    
        fetchUserProfile();  // Gọi hàm async
    }, [token]);  
    

    const login = async (token) => {
        try {
            // Lưu token
            setToken(token);
            localStorage.setItem("token", token);
    
            // Gọi API để lấy thông tin user
            const response = await getUserProfile(token);
            setUser(response.data);  // Giả sử response.data là thông tin user
        } catch (err) {
            console.error("Không thể lấy thông tin người dùng:", err);
            logout();
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
