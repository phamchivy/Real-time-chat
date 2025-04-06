import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/userAPI"; // API reset mật khẩu

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState(""); // Mật khẩu mới
    const [confirmPassword, setConfirmPassword] = useState(""); // Xác nhận mật khẩu mới
    const [error, setError] = useState(""); // Thông báo lỗi nếu có
    const [success, setSuccess] = useState(""); // Thông báo thành công nếu có
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate(); // Dùng để điều hướng sau khi reset mật khẩu

    useEffect(() => {
        // Kiểm tra xem token có hợp lệ hay không khi trang được tải lên
        if (!token) {
            setError("Token không hợp lệ.");
        }
    }, [token]);

    // Hàm xử lý khi người dùng nhấn nút "Reset Password"
    const handleResetPassword = async (e) => {
        e.preventDefault(); // Ngăn chặn reload khi submit form

        // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        // Kiểm tra nếu mật khẩu mới quá ngắn
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        try {
            const response = await resetPassword({ newPassword }, token); // Gọi API reset mật khẩu
            setSuccess(response.data.message); // Hiển thị thông báo thành công
            setError(""); // Reset lỗi nếu có
            setTimeout(() => {
                navigate("/"); // Sau khi reset thành công, chuyển hướng đến trang đăng nhập
            }, 3000);
        } catch (error) {
            setError("Không thể reset mật khẩu: " + (error.response?.data?.message || error.message));
            setSuccess(""); // Reset thông báo thành công nếu có lỗi
        }
    };

    return (
        <div>
            <h2>Đặt lại mật khẩu</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleResetPassword}>
                <div>
                    <label htmlFor="newPassword">Mật khẩu mới:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        required
                    />
                </div>
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
        </div>
    );
};

export default ResetPassword;
