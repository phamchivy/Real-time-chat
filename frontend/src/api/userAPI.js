// src/api/userAPI.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Đăng nhập người dùng
export const loginUser = async (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};

// Đăng ký người dùng
export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

// Lấy thông tin người dùng (yêu cầu token)
export const getUserProfile = async (token) => {
    return axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateUserProfile = async (token, { username, email }) => {
    return axios.put(`${API_URL}/profile`, { username, email }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// API gửi yêu cầu reset mật khẩu
export const forgotPassword = async (data) => {
    return axios.post(`${API_URL}/forgot-password`, data);
};

// API gửi yêu cầu reset mật khẩu
export const resetPassword = async (data, token) => {
    return axios.post(`${API_URL}/reset-password/${token}`, data);
};

// Lấy danh sách tất cả người dùng (trừ current user)
export const getAllUsers = async (token) => {
    return axios.get(`${API_URL}/all-users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

