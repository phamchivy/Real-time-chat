import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userAPI"; // API đăng ký

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !email || !password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const response = await registerUser({ username, email, password });
            setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
            setTimeout(() => {
                navigate("/"); // Quay về trang đăng nhập
            }, 2000);
        } catch (error) {
            console.error("Error during registration:", error);
            if (error.response) {
                setError(error.response.data?.message || "Đăng ký thất bại.");
            } else {
                setError("Không thể kết nối đến server.");
            }
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên người dùng"
                    required
                />
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
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    );
};

export default Register;
