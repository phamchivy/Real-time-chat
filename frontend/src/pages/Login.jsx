// src/components/Login.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userAPI"; // API đăng nhập
import { Link } from "react-router-dom"; // Import Link để tạo liên kết

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Thêm state để lưu thông báo lỗi
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn chặn form reload khi submit
        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            const response = await loginUser({ email, password });
            const token = response.data.token;
            await login(token); // Truyền token vào hàm login trong AuthContext
            navigate("/home");  // Điều hướng sang trang home sau khi đăng nhập thành công
        } catch (error) {
            // Log chi tiết lỗi ra console để debug
            console.error("Error during login:", error);

            // Kiểm tra nếu lỗi có phản hồi từ backend
            if (error.response) {
                console.error("Backend error response:", error.response);
                setError(`Đăng nhập thất bại: ${error.response.data?.message || error.response.statusText}`);
            } else if (error.request) {
                console.error("No response received from the backend:", error.request);
                setError("Không nhận được phản hồi từ server.");
            } else {
                console.error("Error setting up the request:", error.message);
                setError(`Lỗi không xác định: ${error.message}`);
            }
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Hiển thị lỗi nếu có */}
            <form onSubmit={handleLogin}> {/* Sử dụng onSubmit để xử lý khi nhấn Enter */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    required
                />
                <button type="submit">Đăng nhập</button> {/* Đổi onClick thành onSubmit */}
            </form>
            {/* Liên kết đến trang đăng ký */}
            <p>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
            <p>
                Quên mật khẩu? <Link to="/forgot-password">Lấy lại ngay</Link>
            </p>
        </div>
    );
};

export default Login;
