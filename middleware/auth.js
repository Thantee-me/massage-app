const jwt = require('jsonwebtoken');
const { secret } = require('./secret_in_app');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ status: 'error', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.json({ status: 'error', message: 'Invalid token' });
    }
    req.user = user; // Save the user data into the request object
    next(); // Proceed to the next middleware or route handler
  });
};