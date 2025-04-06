// src/components/HomePage.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleGoToProfile = () => {
        navigate("/profile"); // Điều hướng đến trang profile
    };

    const handleGoToChatPage = () => {
        navigate("/chat"); // Điều hướng đến trang profile
    };

    return (
        <div>
            {user ? (
                <>
                    <h1>Chào mừng, {user.username}!</h1>
                    <button onClick={logout}>Đăng xuất</button>
                    <button onClick={handleGoToProfile}>Xem thông tin người dùng</button>
                    <button onClick={handleGoToChatPage}>Vào khung Chat</button>
                </>
            ) : (
                <p>Đang tải thông tin người dùng...</p>
            )}
        </div>
    );
};

export default HomePage;
