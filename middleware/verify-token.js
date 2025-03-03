const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      console.error("No Authorization header found");
      return res.status(401).json({ err: 'No token provided.' });
    }

    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.error("Malformed Authorization header:", req.headers.authorization);
      return res.status(401).json({ err: 'Malformed token format.' });
    }

    const token = tokenParts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ err: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;