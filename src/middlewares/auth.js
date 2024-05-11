import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization middleware
module.exports.isAdmin = (req, res, next) => {
  if (req.userData.type !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};

// Author authorization middleware
module.exports.isAuthor = (req, res, next) => {
  if (req.userData.type !== 'author') {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};

// Retail user authorization middleware
module.exports.isRetailUser = (req, res, next) => {
  if (req.userData.type !== 'retail_user') {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};
