const jwt = require('jsonwebtoken');

exports.generateJwt = (userId, role, location, name) => {
  const payload = { id: userId, role , location, name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); 
};