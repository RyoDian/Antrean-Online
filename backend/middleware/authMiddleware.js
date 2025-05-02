const jwt = require('jsonwebtoken'); // Tambahkan ini di bagian atas file
const User = require('../models/User'); // Pastikan juga impor model User sudah ada

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    // Verifikasi token
    const verified = jwt.verify(token, JWT_SECRET);

    // Pastikan hanya mengirim `verified.id` ke `findById`
    req.user = await User.findById(verified.id);

    // Jika user tidak ditemukan
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Lanjutkan ke route berikutnya
    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Debugging error
    res.status(400).json({ message: 'Invalid token' });
  }
};
