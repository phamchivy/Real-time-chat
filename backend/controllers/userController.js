const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const User = require('../models/user'); // Import User model

// Xử lý logic đăng ký người dùng
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        // Hash mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xử lý logic đăng nhập người dùng
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra người dùng tồn tại
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng.' });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Đăng nhập thành công!', token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Không trả về password
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật thông tin người dùng
const updateUserProfile = async (req, res) => {
    const userId = req.user.id; // Lấy userId từ middleware xác thực
    const { username, email, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Cập nhật thông tin nếu có
        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            // Mã hóa mật khẩu mới nếu có thay đổi
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Lưu thay đổi
        await user.save();

        res.status(200).json({
            message: 'Cập nhật thông tin thành công!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// 📌 Gửi email (Cấu hình theo dịch vụ email bạn dùng)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ API yêu cầu reset mật khẩu
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // 🔑 Tạo reset token ngẫu nhiên
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10); // Hash token để bảo mật

        // Lưu token và thời gian hết hạn (15 phút)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // 📩 Gửi email chứa reset token (hoặc link reset)
        const resetLink = `http://localhost:5000/api/users/reset-password/${resetToken}`;
        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Đặt lại mật khẩu',
                text: `Nhấn vào liên kết để đặt lại mật khẩu: ${resetLink}`
            });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi gửi email', error: error.message });
        }

        res.json({ message: 'Email đặt lại mật khẩu đã được gửi' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params; // Lấy token từ URL
    const { newPassword } = req.body; // Lấy mật khẩu mới từ body

    try {
        // 🔍 Tìm user có resetToken khớp và token chưa hết hạn
        const user = await User.findOne({
            resetPasswordExpires: { $gt: Date.now() } // Kiểm tra token còn hạn không
        });

        if (!user) {
            return res.status(400).json({ message: "Token đã hết hạn." });
        }

        // ✅ So sánh token người dùng gửi với token đã hash trong DB
        const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isMatch) {
            return res.status(400).json({ message: "Token không hợp lệ" });
        }

        // ✅ Hash mật khẩu mới trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 🔄 Cập nhật mật khẩu mới và xóa resetToken
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
    } catch (error) {
        console.error("Lỗi reset password:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
};
