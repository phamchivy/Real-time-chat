const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,  // Lưu token đặt lại mật khẩu
  resetPasswordExpires: Date,   // Lưu thời gian hết hạn của token
});

const User = mongoose.model('User', userSchema);
module.exports = User;
