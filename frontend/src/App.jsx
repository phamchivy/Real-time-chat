import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register"; // hoặc ./components/Register
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import EditProfile from "./pages/EditProfile"; // Import trang chỉnh sửa
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChatPage from "./pages/ChatPage";

const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/" />;
};
const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/chat" element={<PrivateRoute><SocketProvider><ChatPage /></SocketProvider></PrivateRoute>} />
            </Routes>
        </Router>
    </AuthProvider>
);
export default App;

