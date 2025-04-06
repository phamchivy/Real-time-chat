import axios from "axios";

const API_URL = "http://localhost:5000/api/message";

// Lấy tin nhắn giữa currentUser và selectedUser
export const getMessagesWithUser = async (token, userId) => {
    return axios.get(`${API_URL}/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};