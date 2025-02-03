const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Không có token, từ chối truy cập.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Thêm thông tin người dùng vào req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};

module.exports = authMiddleware;
