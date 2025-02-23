// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
    
//     next();
//   } catch (err) {
//     res.status(401).json({ err: 'Invalid token.' });
//   }
// }

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    console.log("Authorization Header:", req.headers.authorization); // 🔍 Log the Authorization header
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


    console.log("Decoded Token:", decoded); // 🔍 Log the decoded token payload

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message); // 🔍 Log any token errors
    return res.status(401).json({ err: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;