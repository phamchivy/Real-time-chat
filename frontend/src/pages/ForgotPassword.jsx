import { useState } from "react";
import { forgotPassword } from "../api/userAPI"; // API để gửi yêu cầu đặt lại mật khẩu

const ForgotPassword = () => {
    const [email, setEmail] = useState(""); // Lưu trữ email người dùng nhập vào
    const [error, setError] = useState(""); // Lưu thông báo lỗi nếu có
    const [success, setSuccess] = useState(""); // Lưu thông báo thành công nếu có

    // Hàm gửi yêu cầu reset mật khẩu
    const handleForgotPassword = async (e) => {
        e.preventDefault(); // Ngăn chặn reload khi submit form

        if (!email) {
            setError("Vui lòng nhập email.");
            return;
        }

        try {
            const response = await forgotPassword({ email });
            setSuccess(response.data.message); // Hiển thị thông báo thành công
            setError(""); // Reset lỗi nếu có
        } catch (error) {
            setError("Không thể gửi yêu cầu: " + (error.response?.data?.message || error.message));
            setSuccess(""); // Reset thành công nếu có lỗi
        }
    };

    return (
        <div>
            <h2>Quên mật khẩu</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleForgotPassword}>
                <div>
                    <label htmlFor="email">Email của bạn:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        required
                    />
                </div>
                <button type="submit">Gửi yêu cầu đặt lại mật khẩu</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
