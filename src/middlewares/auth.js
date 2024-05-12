import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware for user authentication
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for admin authorization
export const isAdmin = (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};

// Middleware for author authorization
export const isAuthor = (req, res, next) => {
  console.log(req.userData);
  if (req.userData.role !== 'author') {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};

// Middleware for retail user authorization
export const isRetailUser = (req, res, next) => {
  if (req.userData.role !== 'retail_user') {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};
