import jwt from 'jsonwebtoken';
import userModel from '../models/Usermodel.js';

/**
 * Middleware to verify that a user is authenticated and has admin privileges
 * This middleware should be used for routes that require admin access
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by id
    const user = decoded;
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Check if user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Add user information to request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in admin authentication middleware:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

export default adminAuth;