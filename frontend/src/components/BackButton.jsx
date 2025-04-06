// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Dẫn tới trang trước đó trong lịch sử duyệt
    };

    return (
        <button onClick={handleBack}>Quay lại</button>
    );
};

export default BackButton;
