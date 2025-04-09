import express from 'express';
import {
  login,
  register,
  forgotpassword,
  resetpassword,
  adminlogin,
  logout,
  getname,
  toggleWishlist,
  checkFavorite,
  getAllUsers,
  getUserById,
  getUserWishlist,
  removeFromWishlist,
  deleteUser,
  // New routes
  sendVerification,
  verifyOTP
} from '../controller/Usercontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const userrouter = express.Router();

// New verification routes
userrouter.post('/send-verification', sendVerification);
userrouter.post('/verify-otp', verifyOTP);

// Existing routes
userrouter.post('/login', login);
userrouter.post('/register', register);
userrouter.post('/forgot', forgotpassword);
userrouter.post('/reset/:token', resetpassword);
userrouter.post('/admin', adminlogin);
userrouter.get('/me', authMiddleware, getname);
userrouter.post('/toggle-wishlist', authMiddleware, toggleWishlist);
userrouter.get('/check-favorite/:propertyId', authMiddleware, checkFavorite);

// Admin routes
userrouter.get('/', authMiddleware, getAllUsers);
userrouter.get('/:id', authMiddleware, getUserById);
userrouter.get('/:id/wishlist', authMiddleware, getUserWishlist);
userrouter.delete('/:id/wishlist/:propertyId', authMiddleware, removeFromWishlist);
userrouter.delete('/:id', authMiddleware, deleteUser);

export default userrouter;