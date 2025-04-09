import jwt from 'jsonwebtoken';
import userModel from '../models/Usermodel.js';

export default async function(req, res, next) {
  // Get token from header
//   const token = req.header('Authorization')?.replace('Bearer ', '');

const token = req.headers.authorization?.split(" ")[1];

// console.log('token : ',token);
  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log('decoded : ',decoded);

    // Find user by id
    const user = await userModel.findById(decoded.id);
    
    // Check if user exists and is an admin
    if (!user) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized: Admin access required' 
      });
    }

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
}