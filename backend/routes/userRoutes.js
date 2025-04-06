const express = require('express');
const { registerUser, loginUser,getUserProfile, updateUserProfile,forgotPassword,resetPassword ,getAllUsers} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Định nghĩa các route và ánh xạ tới controller
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);

// API cập nhật thông tin cá nhân
router.put('/profile', authMiddleware, updateUserProfile);

router.post('/forgot-password', forgotPassword);

router.post("/reset-password/:token",resetPassword);

router.get('/all-users', authMiddleware, getAllUsers);

module.exports = router;
