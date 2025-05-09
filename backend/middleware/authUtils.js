const jwt = require('jsonwebtoken');

exports.generateJwt = (userId, role, location, name , nik) => {
  const payload = { id: userId, role , location, name , nik };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); 
};