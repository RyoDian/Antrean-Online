const User = require('../models/User');

// Middleware untuk verifikasi akses lokasi
module.exports = async (req, res, next) => {
  try {
    const userId = req.user._id; // Mengambil user dari auth middleware
    const locationId = req.params.location_id; // Ubah dari locationId menjadi location_id

    // Cari user dan cek apakah admin terhubung ke lokasi yang sesuai
    const user = await User.findById(userId);
    
    // Jika user adalah super-admin atau user biasa, lanjutkan tanpa pengecekan lokasi
    if (user.role === 'super-admin' || user.role === 'user') {
      return next();
    }

    // Jika bukan super-admin, cek apakah lokasi cocok
    if (!user.location || user.location.toString() !== locationId) {
      return res.status(403).json({ message: 'Access denied to this location' });
    }

    next(); // Lanjutkan jika lokasi cocok
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
