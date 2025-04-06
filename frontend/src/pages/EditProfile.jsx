import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Hook để lấy token người dùng
import { useNavigate } from "react-router-dom"; // Dùng để điều hướng
import { updateUserProfile } from "../api/userAPI"; // API cập nhật thông tin người dùng

const EditProfile = () => {
    const { token, user } = useAuth(); // Lấy token và thông tin người dùng từ context
    const [username, setUsername] = useState(user?.username || ""); // Khởi tạo state cho username
    const [email, setEmail] = useState(user?.email || ""); // Khởi tạo state cho email
    const [error, setError] = useState(""); // Lưu thông báo lỗi nếu có
    const [success, setSuccess] = useState(""); // Lưu thông báo thành công
    const navigate = useNavigate(); // Dùng để điều hướng

    // Hàm gọi API để cập nhật thông tin người dùng
    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Ngăn chặn reload khi submit form

        if (!username || !email) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            const response = await updateUserProfile(token, { username, email });
            setSuccess(response.data.message); // Hiển thị thông báo thành công
            setError(""); // Reset lỗi nếu có
        } catch (error) {
            setError("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
            setSuccess(""); // Reset thành công nếu có lỗi
        }
    };

    return (
        <div>
            <h2>Chỉnh sửa thông tin người dùng</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label htmlFor="username">Tên người dùng:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tên người dùng"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <button type="submit">Cập nhật thông tin</button>
            </form>
        </div>
    );
};

export default EditProfile;
