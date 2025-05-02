module.exports = (allowedRoles) => (req, res, next) => {
  try {
    const userRole = req.user?.role;
    if (!userRole) return res.status(401).json({ message: 'Not authenticated' });

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient role' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
