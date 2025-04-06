import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../api/userAPI"; // API lấy thông tin người dùng
import BackButton from "../components/BackButton";  // Import BackButton component
import { Link } from "react-router-dom";


const ProfilePage = () => {
    const { token } = useAuth(); // Lấy token từ AuthContext
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfile(token); // Gọi API lấy profile
                setUserProfile(response.data); // Lưu thông tin người dùng vào state
            } catch (err) {
                setError("Không thể tải thông tin người dùng.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Thông tin người dùng</h2>
            {userProfile ? (
                <div>
                    <p><strong>ID:</strong> {userProfile._id}</p>
                    <p><strong>Username:</strong> {userProfile.username}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <BackButton /> {/* Sử dụng BackButton */}
                    <Link to="/edit-profile">Chỉnh sửa thông tin</Link> {/* Link đến trang chỉnh sửa */}
                </div>
            ) : (
                <p>Không có thông tin người dùng.</p>
            )}
        </div>
    );
};

export default ProfilePage;
